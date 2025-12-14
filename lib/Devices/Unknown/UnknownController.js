"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnknownController = void 0;
const hap_device_1 = require("@mkellsy/hap-device");
const Common_1 = require("../Common");
/**
 * Defines an unknown device.
 * @public
 */
class UnknownController extends Common_1.Common {
    /**
     * Creates a placeholder for an unknown device.
     *
     * ```js
     * const unknown = new Unknown(processor, area, zone);
     * ```
     *
     * @param processor The processor this device belongs to.
     * @param area The area this device is in.
     * @param zone The zone assigned to this device.
     */
    constructor(processor, area, zone) {
        super(hap_device_1.DeviceType.Unknown, processor, area, zone, { state: "Unknown" });
        /**
         * Controls this device (not supported).
         */
        this.set = () => Promise.resolve();
    }
    /**
     * Recieves a state response from the processor (not supported).
     */
    update() { }
}
exports.UnknownController = UnknownController;
