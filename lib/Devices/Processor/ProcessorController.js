"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProcessorController = void 0;
const js_logger_1 = require("js-logger");
const flat_cache_1 = __importDefault(require("flat-cache"));
const colors_1 = __importDefault(require("colors"));
const os_1 = __importDefault(require("os"));
const path_1 = __importDefault(require("path"));
const event_emitter_1 = require("@mkellsy/event-emitter");
const HEARTBEAT_DURATION = 20000;
/**
 * Defines a LEAP processor. This could be a Caseta Smart Bridge, RA2/RA3
 * Processor, or a Homeworks Processor.
 * @public
 */
class ProcessorController extends event_emitter_1.EventEmitter {
    /**
     * Creates a LEAP processor.
     *
     * @param id The processor UUID.
     * @param connection A reference to the connection to the processor.
     */
    constructor(id, connection) {
        super();
        this.discovered = new Map();
        /*
         * Listener for the processor's connection status.
         */
        this.onConnect = () => {
            this.log.info("connected");
            this.emit("Connect", this.connection);
        };
        /*
         * Listener for when the processor sends a message.
         */
        this.onMessage = (response) => {
            this.log.debug("message");
            this.emit("Message", response);
        };
        /*
         * Listener for when the connection is dropped.
         */
        this.onDisconnect = () => {
            this.log.info("disconnected");
            this.emit("Disconnect");
        };
        /*
         * Listener for when there is an error in the connection.
         */
        this.onError = (error) => {
            this.emit("Error", error);
        };
        this.uuid = id;
        this.logger = (0, js_logger_1.get)(`Processor ${colors_1.default.dim(this.id)}`);
        this.connection = connection;
        this.cache = flat_cache_1.default.load(id, path_1.default.join(os_1.default.homedir(), ".leap"));
        this.connection.on("Connect", this.onConnect);
        this.connection.on("Message", this.onMessage);
        this.connection.on("Error", this.onError);
        this.connection.once("Disconnect", this.onDisconnect);
    }
    /**
     * The processor's unique identifier.
     *
     * @returns The processor id.
     */
    get id() {
        return this.uuid;
    }
    /**
     * A logger for the processor. This will automatically print the
     * processor id.
     *
     * @returns A reference to the logger assigned to this processor.
     */
    get log() {
        return this.logger;
    }
    /**
     * A device map for all devices found on this processor.
     *
     * @returns A device map by device id.
     */
    get devices() {
        return this.discovered;
    }
    /**
     * Connects to a processor.
     */
    connect() {
        return new Promise((resolve, reject) => {
            this.connection
                .connect()
                .then(() => {
                this.startHeartbeat();
                resolve();
            })
                .catch((error) => reject(error));
        });
    }
    /**
     * Disconnects from a processor.
     */
    disconnect() {
        this.stopHeartbeat();
        this.connection.disconnect();
    }
    /**
     * Clears the processor's device cache.
     */
    clear() {
        for (const key of this.cache.keys()) {
            this.cache.removeKey(key);
        }
        this.cache.removeCacheFile();
        this.cache.save();
    }
    /**
     * Pings the processor, useful for keeping the connection alive.
     *
     * @returns A ping response.
     */
    ping() {
        return this.read("/server/1/status/ping");
    }
    /**
     * Sends a read command to the processor.
     *
     * @param url The url to read.
     * @returns A response object.
     */
    read(url) {
        return this.connection.read(url);
    }
    /**
     * Fetches the project information assigned to this processor.
     *
     * @returns A project object.
     */
    project() {
        return new Promise((resolve, reject) => {
            const cached = this.cache.getKey("/project");
            if (cached != null)
                return resolve(cached);
            this.connection
                .read("/project")
                .then((response) => {
                this.cache.setKey("/project", response);
                this.cache.save(true);
                resolve(response);
            })
                .catch((error) => reject(error));
        });
    }
    /**
     * Fetches the processor's system information.
     *
     * @returns The processor as a device, or undefined if the processor
     *          doesn't support this.
     */
    system() {
        return new Promise((resolve, reject) => {
            const cached = this.cache.getKey("/device?where=IsThisDevice:true");
            if (cached != null)
                return resolve(cached);
            this.connection
                .read("/device?where=IsThisDevice:true")
                .then((response) => {
                if (response[0] != null) {
                    this.cache.setKey("/device?where=IsThisDevice:true", response[0]);
                    this.cache.save(true);
                    return resolve(response[0]);
                }
                reject(new Error("No system device found"));
            })
                .catch((error) => reject(error));
        });
    }
    /**
     * Fetches available areas. This represents floors, rooms, and suites.
     *
     * @returns An array of area objects.
     */
    areas() {
        return new Promise((resolve, reject) => {
            const cached = this.cache.getKey("/area");
            if (cached != null)
                return resolve(cached);
            this.connection
                .read("/area")
                .then((response) => {
                this.cache.setKey("/area", response);
                this.cache.save(true);
                resolve(response);
            })
                .catch((error) => reject(error));
        });
    }
    /**
     * Fetches available timeclocks.
     *
     * @returns An array of timeclock objects.
     */
    timeclocks() {
        return new Promise((resolve, reject) => {
            const cached = this.cache.getKey("/timeclock");
            if (cached != null)
                return resolve(cached);
            this.connection
                .read("/timeclock")
                .then((response) => {
                this.cache.setKey("/timeclock", response);
                this.cache.save(true);
                resolve(response);
            })
                .catch((error) => reject(error));
        });
    }
    /**
     * Fetches available zones in an area. Zones represent a light and control.
     * In other systems this is the device.
     *
     * @param address The area to fetch zones.
     *
     * @returns An array of zone objects.
     */
    zones(address) {
        return new Promise((resolve, reject) => {
            const cached = this.cache.getKey(`${address.href}/associatedzone`);
            if (cached != null)
                return resolve(cached);
            this.connection
                .read(`${address.href}/associatedzone`)
                .then((response) => {
                this.cache.setKey(`${address.href}/associatedzone`, response);
                this.cache.save(true);
                resolve(response);
            })
                .catch((error) => reject(error));
        });
    }
    /**
     * Fetches multiple status objects from an area or zone. Typically used to
     * fetch sensor states from an area.
     *
     * @param address Address of an area or zone.
     *
     * @returns A zone status object.
     */
    status(address) {
        return this.read(`${address.href}/status`);
    }
    statuses(type) {
        return new Promise((resolve, reject) => {
            const waits = [];
            waits.push(this.read("/zone/status"));
            waits.push(this.read("/area/status"));
            if (type === "RadioRa3Processor")
                waits.push(this.read("/timeclock/status"));
            Promise.all(waits)
                .then(([zones, areas, timeclocks]) => resolve([...zones, ...areas, ...(timeclocks || [])]))
                .catch((error) => reject(error));
        });
    }
    /**
     * Fetches available control stations of an area or zone. A control station
     * represents a group of keypads or remotes.
     *
     * @param address The address of an area or zone.
     *
     * @returns An array of control station objects.
     */
    controls(address) {
        return new Promise((resolve, reject) => {
            const cached = this.cache.getKey(`${address.href}/associatedcontrolstation`);
            if (cached != null)
                return resolve(cached);
            this.connection
                .read(`${address.href}/associatedcontrolstation`)
                .then((response) => {
                this.cache.setKey(`${address.href}/associatedcontrolstation`, response);
                this.cache.save(true);
                resolve(response);
            })
                .catch((error) => reject(error));
        });
    }
    /**
     * Fetches a single device in a group. This represents a single keypad or
     * Pico remote.
     *
     * @param address An address of a group position.
     *
     * @returns A device object.
     */
    device(address) {
        return new Promise((resolve, reject) => {
            const cached = this.cache.getKey(address.href);
            if (cached != null)
                return resolve(cached);
            this.connection
                .read(address.href)
                .then((response) => {
                this.cache.setKey(address.href, response);
                this.cache.save(true);
                resolve(response);
            })
                .catch((error) => reject(error));
        });
    }
    /**
     * Fetches available buttons on a device.
     *
     * @param address An address or a device.
     *
     * @returns An array of button group objects.
     */
    buttons(address) {
        return new Promise((resolve, reject) => {
            const cached = this.cache.getKey(`${address.href}/buttongroup/expanded`);
            if (cached != null)
                return resolve(cached);
            this.connection
                .read(`${address.href}/buttongroup/expanded`)
                .then((response) => {
                this.cache.setKey(`${address.href}/buttongroup/expanded`, response);
                this.cache.save(true);
                resolve(response);
            })
                .catch((error) => reject(error));
        });
    }
    /**
     * Sends an updatre command to the processor.
     *
     * @param address The address of the record.
     * @param field The field to update.
     * @param value The value to set.
     */
    update(address, field, value) {
        return this.connection.update(`${address.href}/${field}`, value);
    }
    /**
     * Sends a structured command to the processor.
     *
     * @param address The address of the zone or device.
     * @param command The structured command object.
     */
    command(address, command) {
        return this.connection.command(`${address.href}/commandprocessor`, { Command: command });
    }
    /**
     * Subscribes to record updates. This will call the listener every time the
     * record is updated.
     *
     * @param address The assress of the record.
     * @param listener The callback to call on updates.
     */
    subscribe(address, listener) {
        return this.connection.subscribe(address.href, listener);
    }
    /*
     * Starts the ping heartbeat with the processor.
     */
    startHeartbeat() {
        this.stopHeartbeat();
        this.ping().finally(() => {
            this.heartbeatTimeout = setTimeout(() => this.startHeartbeat(), HEARTBEAT_DURATION);
        });
    }
    /*
     * Stops the ping heartbeat.
     */
    stopHeartbeat() {
        clearTimeout(this.heartbeatTimeout);
        this.heartbeatTimeout = undefined;
    }
}
exports.ProcessorController = ProcessorController;
