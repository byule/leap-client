"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeypadController = void 0;
const colors_1 = __importDefault(require("colors"));
const hap_device_1 = require("@mkellsy/hap-device");
const Common_1 = require("../Common");
/**
 * Defines a keypad device.
 * @public
 */
class KeypadController extends Common_1.Common {
    /**
     * Creates a keypad device.
     *
     * ```js
     * const keypad = new Keypad(processor, area, device);
     * ```
     *
     * @param processor The processor this device belongs to.
     * @param area The area this device is in.
     * @param device A refrence to this device.
     */
    constructor(processor, area, device) {
        super(hap_device_1.DeviceType.Keypad, processor, area, device, {
            led: { href: "/unknown" },
            state: "Off",
        });
        this.buttons = [];
        if (device.DeviceType === "SunnataKeypad" || device.DeviceType === "SunnataHybridKeypad") {
            this.processor
                .buttons(this.address)
                .then((groups) => {
                var _a;
                for (let i = 0; i < (groups === null || groups === void 0 ? void 0 : groups.length); i++) {
                    for (let j = 0; j < ((_a = groups[i].Buttons) === null || _a === void 0 ? void 0 : _a.length); j++) {
                        const button = groups[i].Buttons[j];
                        const id = `LEAP-${this.processor.id}-BUTTON-${button.href.split("/")[2]}`;
                        const definition = {
                            id,
                            index: button.ButtonNumber,
                            name: (button.Engraving || {}).Text || button.Name,
                            led: button.AssociatedLED,
                        };
                        this.buttons.push(definition);
                        this.processor
                            .subscribe({ href: `${button.href}/status/event` }, (status) => {
                            const action = status.ButtonEvent.EventType;
                            if (action !== "Press")
                                return;
                            this.emit("Action", this, definition, "Press");
                            setTimeout(() => this.emit("Action", this, definition, "Release"), 100);
                        })
                            .catch((error) => this.log.error(colors_1.default.red(error.message)));
                    }
                }
            })
                .catch((error) => this.log.error(colors_1.default.red(error.message)));
        }
    }
    /**
     * Recieves a state response from the processor (not supported).
     */
    update() {
        this.initialized = true;
    }
    /**
     * Controls this LEDs on this device.
     *
     * ```js
     * keypad.set({ state: { href: "/led/123456" }, state: "On" });
     * ```
     *
     * @param status Desired device state.
     */
    set(status) {
        return this.processor.update(status.led, "status", {
            LEDStatus: { State: status.state === "On" ? "On" : "Off" },
        });
    }
}
exports.KeypadController = KeypadController;
