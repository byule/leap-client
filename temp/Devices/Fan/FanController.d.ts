import { ZoneStatus } from "@mkellsy/hap-device";
import { AreaAddress } from "../../Response/AreaAddress";
import { Common } from "../Common";
import { Fan } from "./Fan";
import { FanState } from "./FanState";
import { Processor } from "../Processor/Processor";
import { ZoneAddress } from "../../Response/ZoneAddress";
/**
 * Defines a fan device.
 * @public
 */
export declare class FanController extends Common<FanState> implements Fan {
    /**
     * Creates a fan device.
     *
     * ```js
     * const fan = new Fan(processor, area, zone);
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
     * fan.update({ SwitchedLevel: "On", FanSpeed: 7 });
     * ```
     *
     * @param status The current device state.
     */
    update(status: ZoneStatus): void;
    /**
     * Controls this device.
     *
     * ```js
     * fan.set({ state: "On", speed: 3 });
     * ```
     *
     * @param status Desired device state.
     */
    set(status: FanState): Promise<void>;
    private lookupFanSpeed;
    private parseFanSpeed;
}
//# sourceMappingURL=FanController.d.ts.map