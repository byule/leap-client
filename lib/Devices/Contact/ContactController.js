"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactController = void 0;
const deep_equal_1 = __importDefault(require("deep-equal"));
const hap_device_1 = require("@mkellsy/hap-device");
const Common_1 = require("../Common");
/**
 * Defines a CCO device.
 * @public
 */
class ContactController extends Common_1.Common {
    /**
     * Creates a CCO device.
     *
     * ```js
     * const cco = new Contact(processor, area, zone);
     * ```
     *
     * @param processor The processor this device belongs to.
     * @param area The area this device is in.
     * @param zone The zone assigned to this device.
     */
    constructor(processor, area, zone) {
        super(hap_device_1.DeviceType.Contact, processor, area, zone, { state: "Open" });
        this.fields.set("state", { type: "String", values: ["Open", "Closed"] });
    }
    /**
     * Recieves a state response from the connection and updates the device
     * state.
     *
     * ```js
     * cco.update({ CCOLevel: "Closed" });
     * ```
     *
     * @param status The current device state.
     */
    update(status) {
        const previous = Object.assign({}, this.status);
        if (status.CCOLevel != null)
            this.state.state = status.CCOLevel;
        if (this.initialized && !(0, deep_equal_1.default)(this.state, previous))
            this.emit("Update", this, this.state);
        this.initialized = true;
    }
    /**
     * Controls this device.
     *
     * ```js
     * cco.set({ state: "Closed" });
     * ```
     *
     * @param status Desired device state.
     */
    set(status) {
        return this.processor.command(this.address, {
            CommandType: "GoToCCOLevel",
            CCOLevelParameters: { CCOLevel: status.state },
        });
    }
}
exports.ContactController = ContactController;
