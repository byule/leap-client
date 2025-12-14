"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RemoteController = void 0;
const colors_1 = __importDefault(require("colors"));
const hap_device_1 = require("@mkellsy/hap-device");
const ButtonMap_1 = require("./ButtonMap");
const Common_1 = require("../Common");
const TriggerController_1 = require("./TriggerController");
/**
 * Defines a Pico remote device.
 * @public
 */
class RemoteController extends Common_1.Common {
    /**
     * Creates a Pico remote device.
     *
     * ```js
     * const remote = new Remote(processor, area, device);
     * ```
     *
     * @param processor The processor this device belongs to.
     * @param area The area this device is in.
     * @param device A refrence to this device.
     */
    constructor(processor, area, device) {
        super(hap_device_1.DeviceType.Remote, processor, area, device, { state: "Unknown" });
        this.buttons = [];
        this.triggers = new Map();
        /**
         * Controls this device (not supported).
         */
        this.set = () => Promise.resolve();
        this.processor
            .buttons(this.address)
            .then((groups) => {
            var _a;
            for (let i = 0; i < (groups === null || groups === void 0 ? void 0 : groups.length); i++) {
                for (let j = 0; j < ((_a = groups[i].Buttons) === null || _a === void 0 ? void 0 : _a.length); j++) {
                    const button = groups[i].Buttons[j];
                    const map = ButtonMap_1.ButtonMap.get(device.DeviceType);
                    const index = map.get(button.ButtonNumber)[0];
                    const raiseLower = map.get(button.ButtonNumber)[1];
                    const trigger = new TriggerController_1.TriggerController(this.processor, button, index, { raiseLower });
                    trigger.on("Press", (button) => {
                        this.emit("Action", this, button, "Press");
                        setTimeout(() => this.emit("Action", this, button, "Release"), 100);
                    });
                    trigger.on("DoublePress", (button) => {
                        this.emit("Action", this, button, "DoublePress");
                        setTimeout(() => this.emit("Action", this, button, "Release"), 100);
                    });
                    trigger.on("LongPress", (button) => {
                        this.emit("Action", this, button, "LongPress");
                        setTimeout(() => this.emit("Action", this, button, "Release"), 100);
                    });
                    this.triggers.set(button.href, trigger);
                    this.buttons.push(trigger.definition);
                    this.processor
                        .subscribe({ href: `${button.href}/status/event` }, (status) => this.triggers.get(button.href).update(status))
                        .catch((error) => this.log.error(colors_1.default.red(error.message)));
                }
            }
        })
            .catch((error) => this.log.error(colors_1.default.red(error.message)));
    }
    /**
     * Recieves a state response from the processor (not supported).
     */
    update() {
        this.initialized = true;
    }
}
exports.RemoteController = RemoteController;
