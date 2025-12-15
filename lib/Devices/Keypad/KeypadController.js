"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KeypadController = void 0;
const colors_1 = __importDefault(require("colors"));
const hap_device_1 = require("@mkellsy/hap-device");
const Common_1 = require("../Common");
const TriggerController_1 = require("../Remote/TriggerController");
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
        this.triggers = new Map();
        if (device.DeviceType === "SunnataKeypad" ||
            device.DeviceType === "SunnataHybridKeypad" ||
            device.DeviceType === "PalladiomKeypad") {
            this.processor
                .buttons(this.address)
                .then((groups) => {
                var _a, _b;
                for (let i = 0; i < (groups === null || groups === void 0 ? void 0 : groups.length); i++) {
                    for (let j = 0; j < ((_a = groups[i].Buttons) === null || _a === void 0 ? void 0 : _a.length); j++) {
                        const button = groups[i].Buttons[j];
                        const id = `LEAP-${this.processor.id}-BUTTON-${button.href.split("/")[2]}`;
                        const programmingType = (_b = button.ProgrammingModel) === null || _b === void 0 ? void 0 : _b.ProgrammingModelType;
                        const definition = {
                            id,
                            index: button.ButtonNumber,
                            name: (button.Engraving || {}).Text || button.Name,
                            led: button.AssociatedLED,
                            supportsLongPress: programmingType === "AdvancedToggleProgrammingModel",
                        };
                        this.buttons.push(definition);
                        // Check if button supports Press+Release (AdvancedToggle) or Press-only (SingleAction)
                        if (programmingType === "AdvancedToggleProgrammingModel") {
                            // Use TriggerController for full Press/Release/DoublePress/LongPress support
                            const trigger = new TriggerController_1.TriggerController(this.processor, button, button.ButtonNumber, {
                                raiseLower: false,
                            });
                            trigger.on("Press", (button) => {
                                this.emit("Action", this, definition, "Press");
                                setTimeout(() => this.emit("Action", this, definition, "Release"), 100);
                            });
                            trigger.on("DoublePress", (button) => {
                                this.emit("Action", this, definition, "DoublePress");
                                setTimeout(() => this.emit("Action", this, definition, "Release"), 100);
                            });
                            trigger.on("LongPress", (button) => {
                                this.emit("Action", this, definition, "LongPress");
                                setTimeout(() => this.emit("Action", this, definition, "Release"), 100);
                            });
                            this.triggers.set(button.href, trigger);
                            this.processor
                                .subscribe({ href: `${button.href}/status/event` }, (status) => this.triggers.get(button.href).update(status))
                                .catch((error) => this.log.error(colors_1.default.red(error.message)));
                        }
                        else {
                            // Press-only button (SingleAction) - support single and double press
                            let lastPressTime = 0;
                            let pressTimeout = null;
                            this.processor
                                .subscribe({ href: `${button.href}/status/event` }, (status) => {
                                const action = status.ButtonEvent.EventType;
                                if (action !== "Press")
                                    return;
                                const now = Date.now();
                                const timeSinceLastPress = now - lastPressTime;
                                // Clear any pending single press
                                if (pressTimeout) {
                                    clearTimeout(pressTimeout);
                                    pressTimeout = null;
                                }
                                // Double press detected (within 500ms)
                                if (timeSinceLastPress < 500 && lastPressTime > 0) {
                                    this.emit("Action", this, definition, "DoublePress");
                                    setTimeout(() => this.emit("Action", this, definition, "Release"), 100);
                                    lastPressTime = 0; // Reset
                                }
                                else {
                                    // Potential single press - wait to see if another press comes
                                    lastPressTime = now;
                                    pressTimeout = setTimeout(() => {
                                        this.emit("Action", this, definition, "Press");
                                        setTimeout(() => this.emit("Action", this, definition, "Release"), 100);
                                        pressTimeout = null;
                                    }, 500);
                                }
                            })
                                .catch((error) => this.log.error(colors_1.default.red(error.message)));
                        }
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
