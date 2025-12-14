"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TimeclockController = void 0;
const deep_equal_1 = __importDefault(require("deep-equal"));
const hap_device_1 = require("@mkellsy/hap-device");
const Common_1 = require("../Common");
/**
 * Defines a timeclock device.
 * @public
 */
class TimeclockController extends Common_1.Common {
    /**
     * Creates a timeclock device.
     *
     * ```js
     * const timeclock = new Timeclock(processor, area, device);
     * ```
     *
     * @param processor The processor this device belongs to.
     * @param area The area this device is in.
     * @param device The reference to the device.
     */
    constructor(processor, area, device) {
        super(hap_device_1.DeviceType.Timeclock, processor, area, device, { state: "Off" });
        /**
         * Controls this device (not supported).
         */
        this.set = () => Promise.resolve();
        this.fields.set("state", { type: "String", values: ["On", "Off"] });
    }
    /**
     * Recieves a state response from the connection and updates the device
     * state.
     *
     * ```js
     * timeclock.update({ EnabledState: "Enabled" });
     * ```
     *
     * @param status The current device state.
     */
    update(status) {
        const previous = Object.assign({}, this.status);
        this.state = Object.assign(Object.assign({}, previous), { state: status.EnabledState === "Enabled" ? "On" : "Off" });
        if (this.initialized && !(0, deep_equal_1.default)(this.state, previous))
            this.emit("Update", this, this.state);
        this.initialized = true;
    }
}
exports.TimeclockController = TimeclockController;
