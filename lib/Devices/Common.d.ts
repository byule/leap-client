import { ILogger } from "js-logger";
import { Action, Address, Area, Button, Capability, Device, DeviceState, DeviceType } from "@mkellsy/hap-device";
import { EventEmitter } from "@mkellsy/event-emitter";
import { Processor } from "./Processor/Processor";
/**
 * Defines common functionallity for a device.
 * @private
 */
export declare abstract class Common<STATE extends DeviceState> extends EventEmitter<{
    Action: (device: Device, button: Button, action: Action) => void;
    Update: (device: Device, state: STATE) => void;
}> {
    protected processor: Processor;
    protected state: STATE;
    protected initialized: boolean;
    protected fields: Map<string, Capability>;
    private logger;
    private deviceName;
    private deviceAddress;
    private deviceArea;
    private deviceType;
    /**
     * Creates a base device object.
     *
     * ```
     * class Fan extends Common {
     *     constructor(id: string, connection: Connection, name: string) {
     *         super(DeviceType.Fan, connection, { id, name, "Fan" });
     *
     *         // Device specific code
     *     }
     * }
     * ```
     *
     * @param type The device type.
     * @param processor The current processor for this device.
     * @param area The area the device belongs to.
     * @param definition Device address definition.
     * @param state The device's initial state.
     */
    constructor(type: DeviceType, processor: Processor, area: Area, definition: {
        href: string;
        Name: string;
    }, state: STATE);
    /**
     * The device's manufacturer.
     *
     * @returns The manufacturer.
     */
    get manufacturer(): string;
    /**
     * The device's unique identifier.
     *
     * @returns The device id.
     */
    get id(): string;
    /**
     * The device's configured name.
     *
     * @returns The device's configured name.
     */
    get name(): string;
    /**
     * The device's configured room.
     *
     * @returns The device's configured room.
     */
    get room(): string;
    /**
     * The devices capibilities. This is a map of the fields that can be set
     * or read.
     *
     * @returns The device's capabilities.
     */
    get capabilities(): {
        [key: string]: Capability;
    };
    /**
     * A logger for the device. This will automatically print the devices name,
     * room and id.
     *
     * @returns A reference to the logger assigned to this device.
     */
    get log(): ILogger;
    /**
     * The href address of the device.
     *
     * @returns The device's href address.
     */
    get address(): Address;
    /**
     * The device type.
     *
     * @returns The device type.
     */
    get type(): DeviceType;
    /**
     * The area the device is in.
     *
     * @returns The device's area.
     */
    get area(): Area;
    /**
     * The current state of the device.
     *
     * @returns The device's state.
     */
    get status(): STATE;
}
//# sourceMappingURL=Common.d.ts.map