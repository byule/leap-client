"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Common = void 0;
const js_logger_1 = require("js-logger");
const hap_device_1 = require("@mkellsy/hap-device");
const colors_1 = __importDefault(require("colors"));
const event_emitter_1 = require("@mkellsy/event-emitter");
/**
 * Defines common functionallity for a device.
 * @private
 */
class Common extends event_emitter_1.EventEmitter {
    /**
     * Creates a base device object.
     *
     * ```
     * class Fan extends Common {
     *     constructor(id: string, connection: Connection, name: string) {
     *         super(DeviceType.Fan, connection, { id, name, "Fan" });
     *
     *         // Device specific code
     *     }
     * }
     * ```
     *
     * @param type The device type.
     * @param processor The current processor for this device.
     * @param area The area the device belongs to.
     * @param definition Device address definition.
     * @param state The device's initial state.
     */
    constructor(type, processor, area, definition, state) {
        super();
        this.initialized = false;
        this.fields = new Map();
        this.processor = processor;
        this.deviceAddress = definition.href;
        this.deviceName = definition.Name;
        this.deviceArea = area;
        this.deviceType = type;
        this.logger = (0, js_logger_1.get)(`Device ${colors_1.default.dim(this.id)}`);
        this.state = state;
    }
    /**
     * The device's manufacturer.
     *
     * @returns The manufacturer.
     */
    get manufacturer() {
        return "Lutron Electronics Co., Inc";
    }
    /**
     * The device's unique identifier.
     *
     * @returns The device id.
     */
    get id() {
        var _a;
        return `LEAP-${this.processor.id}-${hap_device_1.DeviceType[this.deviceType].toUpperCase()}-${(_a = this.deviceAddress) === null || _a === void 0 ? void 0 : _a.split("/")[2]}`;
    }
    /**
     * The device's configured name.
     *
     * @returns The device's configured name.
     */
    get name() {
        return this.deviceName;
    }
    /**
     * The device's configured room.
     *
     * @returns The device's configured room.
     */
    get room() {
        return this.area.Name;
    }
    /**
     * The devices capibilities. This is a map of the fields that can be set
     * or read.
     *
     * @returns The device's capabilities.
     */
    get capabilities() {
        return Object.fromEntries(this.fields);
    }
    /**
     * A logger for the device. This will automatically print the devices name,
     * room and id.
     *
     * @returns A reference to the logger assigned to this device.
     */
    get log() {
        return this.logger;
    }
    /**
     * The href address of the device.
     *
     * @returns The device's href address.
     */
    get address() {
        return { href: this.deviceAddress };
    }
    /**
     * The device type.
     *
     * @returns The device type.
     */
    get type() {
        return this.deviceType;
    }
    /**
     * The area the device is in.
     *
     * @returns The device's area.
     */
    get area() {
        return this.deviceArea;
    }
    /**
     * The current state of the device.
     *
     * @returns The device's state.
     */
    get status() {
        return this.state;
    }
}
exports.Common = Common;
