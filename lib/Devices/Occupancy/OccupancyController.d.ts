import { AreaStatus } from "@mkellsy/hap-device";
import { AreaAddress } from "../../Response/AreaAddress";
import { Common } from "../Common";
import { DeviceAddress } from "../../Response/DeviceAddress";
import { Occupancy } from "./Occupancy";
import { OccupancyState } from "./OccupancyState";
import { Processor } from "../Processor/Processor";
/**
 * Defines a occupancy sensor device.
 * @public
 */
export declare class OccupancyController extends Common<OccupancyState> implements Occupancy {
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
    constructor(processor: Processor, area: AreaAddress, device: DeviceAddress);
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
    update(status: AreaStatus): void;
    /**
     * Controls this device (not supported).
     */
    set: () => Promise<void>;
}
//# sourceMappingURL=OccupancyController.d.ts.map