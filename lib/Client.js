"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const js_logger_1 = require("js-logger");
const colors_1 = __importDefault(require("colors"));
const hap_device_1 = require("@mkellsy/hap-device");
const event_emitter_1 = require("@mkellsy/event-emitter");
const Connection_1 = require("./Connection/Connection");
const Context_1 = require("./Connection/Context");
const Discovery_1 = require("./Connection/Discovery");
const ProcessorController_1 = require("./Devices/Processor/ProcessorController");
const Devices_1 = require("./Devices/Devices");
const log = (0, js_logger_1.get)("Client");
const RETRY_BACKOFF_DURATION = 5000;
/**
 * Creates an object that represents a single location, with a single network.
 * @public
 */
class Client extends event_emitter_1.EventEmitter {
    /**
     * Creates a location object and starts mDNS discovery.
     *
     * ```js
     * const location = new Client();
     *
     * location.on("Avaliable", (devices: Device[]) => {  });
     * ```
     *
     * @param refresh If true, this will ignore any cache and reload.
     */
    constructor(refresh) {
        super(Infinity);
        this.discovered = new Map();
        /*
         * Creates a connection when mDNS finds a processor.
         */
        this.onDiscovered = (host) => {
            this.discovered.delete(host.id);
            if (!this.context.has(host.id))
                return;
            const ip = host.addresses.find((address) => address.family === hap_device_1.HostAddressFamily.IPv4) || host.addresses[0];
            const processor = new ProcessorController_1.ProcessorController(host.id, new Connection_1.Connection(ip.address, this.context.get(host.id)));
            this.discovered.set(host.id, processor);
            processor.log.info(`Processor ${colors_1.default.green(ip.address)}`);
            processor
                .on("Disconnect", () => {
                setTimeout(() => this.onDiscovered(host), RETRY_BACKOFF_DURATION);
            })
                .on("Connect", () => {
                if (this.refresh)
                    processor.clear();
                // RESET RETRIES
                Promise.all([processor.system(), processor.project(), processor.areas()])
                    .then(([system, project, areas]) => {
                    const version = system === null || system === void 0 ? void 0 : system.FirmwareImage.Firmware.DisplayName;
                    const type = system === null || system === void 0 ? void 0 : system.DeviceType;
                    const waits = [];
                    processor.log.info(`Firmware ${colors_1.default.green(version || "Unknown")}`);
                    processor.log.info(project.ProductType);
                    processor
                        .subscribe({ href: "/zone/status" }, (statuses) => {
                        for (const status of statuses) {
                            const device = processor.devices.get(status.Zone.href);
                            if (device != null)
                                device.update(status);
                        }
                    })
                        .catch((error) => this.onProcessorError(host, error));
                    processor
                        .subscribe({ href: "/area/status" }, (statuses) => {
                        var _a;
                        for (const status of statuses) {
                            const occupancy = processor.devices.get(`/occupancy/${(_a = status.href) === null || _a === void 0 ? void 0 : _a.split("/")[2]}`);
                            if (occupancy != null && status.OccupancyStatus != null)
                                occupancy.update(status);
                        }
                    })
                        .catch((error) => this.onProcessorError(host, error));
                    if (type === "RadioRa3Processor") {
                        processor
                            .subscribe({ href: "/timeclock/status" }, (statuses) => {
                            for (const status of statuses) {
                                const device = processor.devices.get(status.Timeclock.href);
                                if (device != null)
                                    device.update(status);
                            }
                        })
                            .catch((error) => this.onProcessorError(host, error));
                    }
                    for (const area of areas) {
                        waits.push(new Promise((resolve) => {
                            this.discoverZones(processor, area).then(() => resolve());
                        }));
                        waits.push(new Promise((resolve) => {
                            this.discoverControls(processor, area).then(() => resolve());
                        }));
                    }
                    if (type === "RadioRa3Processor") {
                        waits.push(new Promise((resolve) => {
                            this.discoverTimeclocks(processor).then(() => resolve());
                        }));
                    }
                    Promise.all(waits).then(() => {
                        processor.statuses(type).then((statuses) => {
                            for (const status of statuses) {
                                const zone = processor.devices.get((status.Zone || {}).href || "");
                                const occupancy = processor.devices.get(`/occupancy/${(status.href || "").split("/")[2]}`);
                                if (zone != null)
                                    zone.update(status);
                                if (occupancy != null && status.OccupancyStatus != null) {
                                    occupancy.update(status);
                                }
                            }
                        });
                        processor.log.info(`discovered ${colors_1.default.green([...processor.devices.keys()].length.toString())} devices`);
                        this.emit("Available", [...processor.devices.values()]);
                    });
                })
                    .catch((error) => this.onProcessorError(host, error));
            })
                .on("Error", (error) => this.onProcessorError(host, error));
            processor.connect().catch((error) => this.onProcessorError(host, error));
        };
        /*
         * When a device updates, this will emit an update event.
         */
        this.onDeviceUpdate = (device, state) => {
            this.emit("Update", device, state);
        };
        /*
         * When a control station emits an action, this will emit an action event.
         * This is when a button is pressed on a keypad or remote.
         */
        this.onDeviceAction = (device, button, action) => {
            this.emit("Action", device, button, action);
        };
        this.onProcessorError = (host, error) => {
            if (error.message == null) {
                log.error(colors_1.default.red(String(error)));
                return;
            }
            if (error.message.match(/ENOTFOUND|ENETUNREACH|EHOSTUNREACH|ECONNRESET|EPIPE|ECONNREFUSED|ETIMEDOUT/g) != null) {
                setTimeout(() => this.onDiscovered(host), RETRY_BACKOFF_DURATION);
                return;
            }
            log.error(colors_1.default.red(error.message));
        };
        this.context = new Context_1.Context();
        this.discovery = new Discovery_1.Discovery();
        this.refresh = refresh === true;
        this.discovery.on("Discovered", this.onDiscovered).search();
    }
    /**
     * A list of processors in this location.
     *
     * @returns A string array of processor ids.
     */
    get processors() {
        return [...this.discovered.keys()];
    }
    /**
     * Fetch a processor from this location.
     *
     * @param id The processor id to fetch.
     *
     * @returns A processor object or undefined if it doesn't exist.
     */
    processor(id) {
        return this.discovered.get(id);
    }
    /**
     * Closes all connections for a location and stops searching.
     */
    close() {
        this.discovery.stop();
        for (const processor of this.discovered.values()) {
            processor.disconnect();
        }
        this.discovered.clear();
    }
    /*
     * Discovers all available zones on this processor. In other systems this
     * is the device.
     */
    discoverZones(processor, area) {
        return new Promise((resolve) => {
            if (!area.IsLeaf)
                return resolve();
            processor
                .zones(area)
                .then((zones) => {
                for (const zone of zones) {
                    const device = (0, Devices_1.createDevice)(processor, area, zone)
                        .on("Update", this.onDeviceUpdate)
                        .on("Action", this.onDeviceAction);
                    processor.devices.set(zone.href, device);
                }
                resolve();
            })
                .catch(() => resolve());
        });
    }
    /*
     * Discovers all available timeclocks. Timeclocks are schedules, and
     * sometimes are used as vurtual switches.
     */
    discoverTimeclocks(processor) {
        return new Promise((resolve) => {
            processor
                .timeclocks()
                .then((timeclocks) => {
                for (const timeclock of timeclocks) {
                    const device = (0, Devices_1.createDevice)(processor, {
                        href: timeclock.href,
                        Name: timeclock.Name,
                        ControlType: "Timeclock",
                        Parent: timeclock.Parent,
                        IsLeaf: true,
                        AssociatedZones: [],
                        AssociatedControlStations: [],
                        AssociatedOccupancyGroups: [],
                    }, Object.assign(Object.assign({}, timeclock), { ControlType: "Timeclock" })).on("Update", this.onDeviceUpdate);
                    processor.devices.set(timeclock.href, device);
                }
                resolve();
            })
                .catch(() => resolve());
        });
    }
    /*
     * Discovers all keypads and remotes. These are ganged devices.
     */
    discoverControls(processor, area) {
        return new Promise((resolve) => {
            if (!area.IsLeaf)
                return resolve();
            processor
                .controls(area)
                .then((controls) => {
                for (const control of controls) {
                    this.discoverPositions(processor, control).then((positions) => {
                        var _a;
                        for (const position of positions) {
                            const type = (0, Devices_1.parseDeviceType)(position.DeviceType);
                            const address = type === hap_device_1.DeviceType.Occupancy
                                ? `/occupancy/${(_a = area.href) === null || _a === void 0 ? void 0 : _a.split("/")[2]}`
                                : position.href;
                            const device = (0, Devices_1.createDevice)(processor, area, Object.assign(Object.assign({}, position), { Name: `${area.Name} ${control.Name} ${position.Name}` }))
                                .on("Update", this.onDeviceUpdate)
                                .on("Action", this.onDeviceAction);
                            processor.devices.set(address, device);
                        }
                        resolve();
                    });
                }
            })
                .catch(() => resolve());
        });
    }
    /*
     * Discovers individual positions in a control station. Represents a single
     * keypad or remote in a gang.
     */
    discoverPositions(processor, control) {
        return new Promise((resolve) => {
            if (control.AssociatedGangedDevices == null)
                return resolve([]);
            const waits = [];
            for (const gangedDevice of control.AssociatedGangedDevices) {
                waits.push(processor.device(gangedDevice.Device));
            }
            Promise.all(waits)
                .then((positions) => {
                resolve(positions.filter((position) => (0, Devices_1.isAddressable)(position)));
            })
                .catch(() => resolve([]));
        });
    }
}
exports.Client = Client;
