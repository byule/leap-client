import { Button, DeviceState } from "@mkellsy/hap-device";
import { AreaAddress } from "../../Response/AreaAddress";
import { Common } from "../Common";
import { DeviceAddress } from "../../Response/DeviceAddress";
import { Processor } from "../Processor/Processor";
import { Remote } from "./Remote";
/**
 * Defines a Pico remote device.
 * @public
 */
export declare class RemoteController extends Common<DeviceState> implements Remote {
    readonly buttons: Button[];
    private triggers;
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
    constructor(processor: Processor, area: AreaAddress, device: DeviceAddress);
    /**
     * Recieves a state response from the processor (not supported).
     */
    update(): void;
    /**
     * Controls this device (not supported).
     */
    set: () => Promise<void>;
}
//# sourceMappingURL=RemoteController.d.ts.map