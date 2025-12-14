"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShadeController = void 0;
const deep_equal_1 = __importDefault(require("deep-equal"));
const hap_device_1 = require("@mkellsy/hap-device");
const Common_1 = require("../Common");
/**
 * Defines a window shade device.
 * @public
 */
class ShadeController extends Common_1.Common {
    /**
     * Creates a window shade device.
     *
     * ```js
     * const shade = new Shade(processor, area, zone);
     * ```
     *
     * @param processor The processor this device belongs to.
     * @param area The area this device is in.
     * @param zone The zone assigned to this device.
     */
    constructor(processor, area, zone) {
        super(hap_device_1.DeviceType.Shade, processor, area, zone, {
            state: "Closed",
            level: 0,
            tilt: 0,
        });
        this.fields.set("state", { type: "String", values: ["Open", "Closed"] });
        this.fields.set("level", { type: "Integer", min: 0, max: 100 });
        this.fields.set("tilt", { type: "Integer", min: 0, max: 100 });
    }
    /**
     * Recieves a state response from the connection and updates the device
     * state.
     *
     * ```js
     * shade.update({ Level: 100 });
     * ```
     *
     * @param status The current device state.
     */
    update(status) {
        const previous = Object.assign({}, this.status);
        if (status.Level != null) {
            this.state.state = status.Level > 0 ? "Open" : "Closed";
            this.state.level = status.Level;
        }
        if (status.Tilt != null)
            this.state.tilt = status.Tilt;
        if (this.initialized && !(0, deep_equal_1.default)(this.state, previous))
            this.emit("Update", this, this.state);
        this.initialized = true;
    }
    /**
     * Controls this device.
     *
     * ```js
     * shade.set({ state: "Open", level: 50, tilt: 50 });
     * ```
     *
     * @param status Desired device state.
     */
    set(status) {
        const waits = [];
        waits.push(this.processor.command(this.address, {
            CommandType: "GoToLevel",
            Parameter: [{ Type: "Level", Value: status.state === "Closed" ? 0 : status.level }],
        }));
        if (status.tilt != null || status.state === "Closed") {
            waits.push(this.processor.command(this.address, {
                CommandType: "TiltParameters",
                TiltParameters: { Tilt: status.state === "Closed" ? 0 : status.tilt },
            }));
        }
        return Promise.all(waits);
    }
}
exports.ShadeController = ShadeController;
