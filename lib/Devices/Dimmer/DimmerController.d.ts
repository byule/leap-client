import { ZoneStatus } from "@mkellsy/hap-device";
import { AreaAddress } from "../../Response/AreaAddress";
import { Common } from "../Common";
import { Dimmer } from "./Dimmer";
import { DimmerState } from "./DimmerState";
import { Processor } from "../Processor/Processor";
import { ZoneAddress } from "../../Response/ZoneAddress";
/**
 * Defines a dimmable light device.
 * @public
 */
export declare class DimmerController extends Common<DimmerState> implements Dimmer {
    /**
     * Creates a dimmable light device.
     *
     * ```js
     * const dimmer = new Dimmer(processor, area, zone);
     * ```
     *
     * @param processor The processor this device belongs to.
     * @param area The area this device is in.
     * @param zone The zone assigned to this device.
     */
    constructor(processor: Processor, area: AreaAddress, zone: ZoneAddress);
    /**
     * Recieves a state response from the connection and updates the device
     * state.
     *
     * ```js
     * dimmer.update({ Level: 100 });
     * ```
     *
     * @param status The current device state.
     */
    update(status: ZoneStatus): void;
    /**
     * Controls this device.
     *
     * ```js
     * dimmer.set({ state: "On", level: 50 });
     * ```
     *
     * @param status Desired device state.
     */
    set(status: DimmerState): Promise<void>;
}
//# sourceMappingURL=DimmerController.d.ts.map