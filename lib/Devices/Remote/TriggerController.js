"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TriggerController = void 0;
const hap_device_1 = require("@mkellsy/hap-device");
const event_emitter_1 = require("@mkellsy/event-emitter");
/**
 * Defines a button tracker. This enables single, double and long presses on
 * remotes.
 * @public
 */
class TriggerController extends event_emitter_1.EventEmitter {
    /**
     * Creates a button tracker.
     *
     * @param processor A refrence to the processor.
     * @param button A reference to the individual button.
     * @param index An index of the button on the device.
     * @param options Button options like click speed, raise or lower.
     */
    constructor(processor, button, index, options) {
        super();
        this.state = hap_device_1.TriggerState.Idle;
        this.index = index;
        this.processor = processor;
        this.action = button;
        this.options = Object.assign({ doubleClickSpeed: 300, clickSpeed: 450, raiseLower: false }, options);
        this.button = {
            id: this.id,
            index: this.index,
            name: (this.action.Engraving || {}).Text || this.action.Name,
        };
        if (this.options.raiseLower === true)
            this.button.raiseLower = true;
    }
    /**
     * The button id.
     *
     * @returns A string of the button id.
     */
    get id() {
        return `LEAP-${this.processor.id}-BUTTON-${this.action.href.split("/")[2]}`;
    }
    /**
     * The definition of the button.
     *
     * @returns A button object.
     */
    get definition() {
        return this.button;
    }
    /**
     * Resets the button state to idle.
     */
    reset() {
        this.state = hap_device_1.TriggerState.Idle;
        if (this.timer)
            clearTimeout(this.timer);
        this.timer = undefined;
    }
    /**
     * Updates the button state and tracks single, double or long presses.
     *
     * @param status The current button status.
     */
    update(status) {
        const longPressTimeoutHandler = () => {
            this.reset();
            /*
             * Testing this edge case is not reliable in unit tests. This
             * prevents false positives.
             */
            /* istanbul ignore next */
            if (this.options.clickSpeed === 0)
                return;
            this.emit("LongPress", this.button);
        };
        const doublePressTimeoutHandler = () => {
            this.reset();
            this.emit("Press", this.button);
        };
        switch (this.state) {
            case hap_device_1.TriggerState.Idle: {
                if (status.ButtonEvent.EventType === "Press" && this.options.clickSpeed > 0) {
                    this.state = hap_device_1.TriggerState.Down;
                    this.timer = setTimeout(longPressTimeoutHandler, this.options.clickSpeed);
                    return;
                }
                if (status.ButtonEvent.EventType === "Press") {
                    this.state = hap_device_1.TriggerState.Down;
                    doublePressTimeoutHandler();
                    return;
                }
                break;
            }
            case hap_device_1.TriggerState.Down: {
                if (status.ButtonEvent.EventType === "Release") {
                    this.state = hap_device_1.TriggerState.Up;
                    /*
                     * Getting the unit tests to trigger this edge case is
                     * un-reliable. This prevents false positives.
                     */
                    /* istanbul ignore else */
                    if (this.timer)
                        clearTimeout(this.timer);
                    if (this.options.doubleClickSpeed > 0) {
                        this.timer = setTimeout(doublePressTimeoutHandler, this.options.doubleClickSpeed + (this.options.raiseLower ? 250 : 0));
                    }
                    return;
                }
                this.reset();
                break;
            }
            case hap_device_1.TriggerState.Up: {
                if (status.ButtonEvent.EventType === "Press" && this.timer) {
                    this.reset();
                    if (this.options.doubleClickSpeed === 0)
                        return;
                    this.emit("DoublePress", this.button);
                    return;
                }
                this.reset();
                break;
            }
        }
    }
}
exports.TriggerController = TriggerController;
