import { DeviceState } from "@mkellsy/hap-device";
import { AreaAddress } from "../../Response/AreaAddress";
import { Common } from "../Common";
import { Processor } from "../Processor/Processor";
import { Unknown } from "./Unknown";
import { ZoneAddress } from "../../Response/ZoneAddress";
/**
 * Defines an unknown device.
 * @public
 */
export declare class UnknownController extends Common<DeviceState> implements Unknown {
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
    constructor(processor: Processor, area: AreaAddress, zone: ZoneAddress);
    /**
     * Recieves a state response from the processor (not supported).
     */
    update(): void;
    /**
     * Controls this device (not supported).
     */
    set: () => Promise<void>;
}
//# sourceMappingURL=UnknownController.d.ts.map