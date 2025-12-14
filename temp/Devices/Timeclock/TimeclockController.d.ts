import { TimeclockStatus } from "@mkellsy/hap-device";
import { AreaAddress } from "../../Response/AreaAddress";
import { Common } from "../Common";
import { Processor } from "../Processor/Processor";
import { Timeclock } from "./Timeclock";
import { TimeclockAddress } from "../../Response/TimeclockAddress";
import { TimeclockState } from "./TimeclockState";
/**
 * Defines a timeclock device.
 * @public
 */
export declare class TimeclockController extends Common<TimeclockState> implements Timeclock {
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
    constructor(processor: Processor, area: AreaAddress, device: TimeclockAddress);
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
    update(status: TimeclockStatus): void;
    /**
     * Controls this device (not supported).
     */
    set: () => Promise<void>;
}
//# sourceMappingURL=TimeclockController.d.ts.map