"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OccupancyController = void 0;
const deep_equal_1 = __importDefault(require("deep-equal"));
const hap_device_1 = require("@mkellsy/hap-device");
const Common_1 = require("../Common");
/**
 * Defines a occupancy sensor device.
 * @public
 */
class OccupancyController extends Common_1.Common {
    /**
     * Creates a occupancy sensor device.
     *
     * ```js
     * const sensor = new Occupancy(processor, area, device);
     * ```
     *
     * @param processor The processor this device belongs to.
     * @param area The area this device is in.
     * @param device The refrence to this device.
     */
    constructor(processor, area, device) {
        super(hap_device_1.DeviceType.Occupancy, processor, area, device, { state: "Unoccupied" });
        /**
         * Controls this device (not supported).
         */
        this.set = () => Promise.resolve();
    }
    /**
     * Recieves a state response from the connection and updates the device
     * state.
     *
     * ```js
     * sensor.update({ OccupancyStatus: "Occupied" });
     * ```
     *
     * @param status The current device state.
     */
    update(status) {
        const previous = Object.assign({}, this.status);
        if (status.OccupancyStatus != null) {
            this.state.state = status.OccupancyStatus === "Occupied" ? "Occupied" : "Unoccupied";
        }
        if (!(0, deep_equal_1.default)(this.state, previous))
            this.emit("Update", this, this.state);
        this.initialized = true;
    }
}
exports.OccupancyController = OccupancyController;
