import { ZoneStatus } from "@mkellsy/hap-device";
import { AreaAddress } from "../../Response/AreaAddress";
import { Common } from "../Common";
import { Processor } from "../Processor/Processor";
import { Switch } from "./Switch";
import { SwitchState } from "./SwitchState";
import { ZoneAddress } from "../../Response/ZoneAddress";
/**
 * Defines a on/off switch device.
 * @public
 */
export declare class SwitchController extends Common<SwitchState> implements Switch {
    /**
     * Creates a on/off switch device.
     *
     * ```js
     * const switch = new Switch(processor, area, zone);
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
     * switch.update({ SwitchedLevel: "On" });
     * ```
     *
     * @param status The current device state.
     */
    update(status: ZoneStatus): void;
    /**
     * Controls this device.
     *
     * ```js
     * switch.set({ state: "On" });
     * ```
     *
     * @param status Desired device state.
     */
    set(status: SwitchState): Promise<void>;
}
//# sourceMappingURL=SwitchController.d.ts.map