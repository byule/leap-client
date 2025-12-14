"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StripController = void 0;
const deep_equal_1 = __importDefault(require("deep-equal"));
const hap_device_1 = require("@mkellsy/hap-device");
const Common_1 = require("../Common");
/**
 * Defines a LED strip device.
 * @public
 */
class StripController extends Common_1.Common {
    /**
     * Creates a LED strip device.
     *
     * ```js
     * const strip = new Strip(processor, area, zone);
     * ```
     *
     * @param processor The processor this device belongs to.
     * @param area The area this device is in.
     * @param zone The zone assigned to this device.
     */
    constructor(processor, area, zone) {
        super(hap_device_1.DeviceType.Strip, processor, area, zone, {
            state: "Off",
            level: 0,
            luminance: 1800,
        });
        this.fields.set("state", { type: "String", values: ["On", "Off"] });
        this.fields.set("level", { type: "Integer", min: 0, max: 100 });
        this.fields.set("luminance", { type: "Integer", min: 1800, max: 3000 });
    }
    /**
     * Recieves a state response from the connection and updates the device
     * state.
     *
     * ```js
     * strip.update({ Level: 100 });
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
        if (status.ColorTuningStatus != null &&
            status.ColorTuningStatus.WhiteTuningLevel != null &&
            status.ColorTuningStatus.WhiteTuningLevel.Kelvin != null) {
            this.state.luminance = status.ColorTuningStatus.WhiteTuningLevel.Kelvin;
        }
        if (this.initialized && !(0, deep_equal_1.default)(this.state, previous))
            this.emit("Update", this, this.state);
        this.initialized = true;
    }
    /**
     * Controls this device.
     *
     * ```js
     * strip.set({ state: "On", level: 50, luminance: 3000 });
     * ```
     *
     * @param status Desired device state.
     */
    set(status) {
        if (status.state === "Off") {
            return this.processor.command(this.address, {
                CommandType: "GoToWhiteTuningLevel",
                WhiteTuningLevelParameters: { Level: 0 },
            });
        }
        return this.processor.command(this.address, {
            CommandType: "GoToWhiteTuningLevel",
            WhiteTuningLevelParameters: {
                Level: status.level,
                WhiteTuningLevel: { Kelvin: status.luminance },
            },
        });
    }
}
exports.StripController = StripController;
