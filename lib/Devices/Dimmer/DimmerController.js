"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DimmerController = void 0;
const deep_equal_1 = __importDefault(require("deep-equal"));
const hap_device_1 = require("@mkellsy/hap-device");
const Common_1 = require("../Common");
/**
 * Defines a dimmable light device.
 * @public
 */
class DimmerController extends Common_1.Common {
    /**
     * Creates a dimmable light device.
     *
     * ```js
     * const dimmer = new Dimmer(processor, area, zone);
     * ```
     *
     * @param processor The processor this device belongs to.
     * @param area The area this device is in.
     * @param zone The zone assigned to this device.
     */
    constructor(processor, area, zone) {
        super(hap_device_1.DeviceType.Dimmer, processor, area, zone, { state: "Off", level: 0 });
        this.fields.set("state", { type: "String", values: ["On", "Off"] });
        this.fields.set("level", { type: "Integer", min: 0, max: 100 });
    }
    /**
     * Recieves a state response from the connection and updates the device
     * state.
     *
     * ```js
     * dimmer.update({ Level: 100 });
     * ```
     *
     * @param status The current device state.
     */
    update(status) {
        const previous = Object.assign({}, this.status);
        if (status.Level != null) {
            this.state.state = status.Level > 0 ? "On" : "Off";
            this.state.level = status.Level;
        }
        if (this.initialized && !(0, deep_equal_1.default)(this.state, previous))
            this.emit("Update", this, this.state);
        this.initialized = true;
    }
    /**
     * Controls this device.
     *
     * ```js
     * dimmer.set({ state: "On", level: 50 });
     * ```
     *
     * @param status Desired device state.
     */
    set(status) {
        return this.processor.command(this.address, {
            CommandType: "GoToLevel",
            Parameter: [{ Type: "Level", Value: status.state === "Off" ? 0 : status.level }],
        });
    }
}
exports.DimmerController = DimmerController;
