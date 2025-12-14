import { ZoneStatus } from "@mkellsy/hap-device";
import { AreaAddress } from "../../Response/AreaAddress";
import { Common } from "../Common";
import { Processor } from "../Processor/Processor";
import { Shade } from "./Shade";
import { ShadeState } from "./ShadeState";
import { ZoneAddress } from "../../Response/ZoneAddress";
/**
 * Defines a window shade device.
 * @public
 */
export declare class ShadeController extends Common<ShadeState> implements Shade {
    /**
     * Creates a window shade device.
     *
     * ```js
     * const shade = new Shade(processor, area, zone);
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
     * shade.update({ Level: 100 });
     * ```
     *
     * @param status The current device state.
     */
    update(status: ZoneStatus): void;
    /**
     * Controls this device.
     *
     * ```js
     * shade.set({ state: "Open", level: 50, tilt: 50 });
     * ```
     *
     * @param status Desired device state.
     */
    set(status: ShadeState): Promise<void>;
}
//# sourceMappingURL=ShadeController.d.ts.map