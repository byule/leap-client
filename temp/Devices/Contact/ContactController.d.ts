import { ZoneStatus } from "@mkellsy/hap-device";
import { AreaAddress } from "../../Response/AreaAddress";
import { Common } from "../Common";
import { Contact } from "./Contact";
import { ContactState } from "./ContactState";
import { Processor } from "../Processor/Processor";
import { ZoneAddress } from "../../Response/ZoneAddress";
/**
 * Defines a CCO device.
 * @public
 */
export declare class ContactController extends Common<ContactState> implements Contact {
    /**
     * Creates a CCO device.
     *
     * ```js
     * const cco = new Contact(processor, area, zone);
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
     * cco.update({ CCOLevel: "Closed" });
     * ```
     *
     * @param status The current device state.
     */
    update(status: ZoneStatus): void;
    /**
     * Controls this device.
     *
     * ```js
     * cco.set({ state: "Closed" });
     * ```
     *
     * @param status Desired device state.
     */
    set(status: ContactState): Promise<void>;
}
//# sourceMappingURL=ContactController.d.ts.map