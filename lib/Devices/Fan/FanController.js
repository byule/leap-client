"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FanController = void 0;
const deep_equal_1 = __importDefault(require("deep-equal"));
const hap_device_1 = require("@mkellsy/hap-device");
const Common_1 = require("../Common");
/**
 * Defines a fan device.
 * @public
 */
class FanController extends Common_1.Common {
    /**
     * Creates a fan device.
     *
     * ```js
     * const fan = new Fan(processor, area, zone);
     * ```
     *
     * @param processor The processor this device belongs to.
     * @param area The area this device is in.
     * @param zone The zone assigned to this device.
     */
    constructor(processor, area, zone) {
        super(hap_device_1.DeviceType.Fan, processor, area, zone, { state: "Off", speed: 0 });
        this.fields.set("state", { type: "String", values: ["On", "Off"] });
        this.fields.set("speed", { type: "Integer", min: 0, max: 7 });
    }
    /**
     * Recieves a state response from the connection and updates the device
     * state.
     *
     * ```js
     * fan.update({ SwitchedLevel: "On", FanSpeed: 7 });
     * ```
     *
     * @param status The current device state.
     */
    update(status) {
        const previous = Object.assign({}, this.status);
        const speed = this.parseFanSpeed(status.FanSpeed);
        this.state = Object.assign(Object.assign({}, previous), { state: speed > 0 ? "On" : "Off", speed });
        if (this.initialized && !(0, deep_equal_1.default)(this.state, previous))
            this.emit("Update", this, this.state);
        this.initialized = true;
    }
    /**
     * Controls this device.
     *
     * ```js
     * fan.set({ state: "On", speed: 3 });
     * ```
     *
     * @param status Desired device state.
     */
    set(status) {
        const speed = status.state === "Off" ? "Off" : this.lookupFanSpeed(status.speed);
        return this.processor.command(this.address, {
            CommandType: "GoToFanSpeed",
            FanSpeedParameters: [{ FanSpeed: speed }],
        });
    }
    /*
     * Converts a 7 speed setting to a 4 speed string value.
     */
    lookupFanSpeed(value) {
        switch (value) {
            case 1:
                return "Low";
            case 2:
            case 3:
                return "Medium";
            case 4:
            case 5:
                return "MediumHigh";
            case 6:
            case 7:
                return "High";
            default:
                return "Off";
        }
    }
    /*
     * Converts a 4 speed string speed to a numeric 7 speed value.
     */
    parseFanSpeed(value) {
        switch (value) {
            case "Low":
                return 1;
            case "Medium":
                return 3;
            case "MediumHigh":
                return 5;
            case "High":
                return 7;
            default:
                return 0;
        }
    }
}
exports.FanController = FanController;
