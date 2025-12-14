import { ZoneStatus } from "@mkellsy/hap-device";
import { AreaAddress } from "../../Response/AreaAddress";
import { Common } from "../Common";
import { Processor } from "../Processor/Processor";
import { Strip } from "./Strip";
import { StripState } from "./StripState";
import { ZoneAddress } from "../../Response/ZoneAddress";
/**
 * Defines a LED strip device.
 * @public
 */
export declare class StripController extends Common<StripState> implements Strip {
    /**
     * Creates a LED strip device.
     *
     * ```js
     * const strip = new Strip(processor, area, zone);
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
     * strip.update({ Level: 100 });
     * ```
     *
     * @param status The current device state.
     */
    update(status: ZoneStatus): void;
    /**
     * Controls this device.
     *
     * ```js
     * strip.set({ state: "On", level: 50, luminance: 3000 });
     * ```
     *
     * @param status Desired device state.
     */
    set(status: StripState): Promise<void>;
}
//# sourceMappingURL=StripController.d.ts.map