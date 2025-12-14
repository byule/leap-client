/**
 * Publishes devices, states and actions to an event emitter using the Lutron
 * LEAP protocol.
 *
 * @remarks
 * This will autopmatically discover processors. You will need to press the
 * pairing button on your processor or bridge.
 *
 * @packageDocumentation
 */
import { Client } from "./Client";
export { Contact } from "./Devices/Contact/Contact";
export { ContactState } from "./Devices/Contact/ContactState";
export { Dimmer } from "./Devices/Dimmer/Dimmer";
export { DimmerState } from "./Devices/Dimmer/DimmerState";
export { Fan } from "./Devices/Fan/Fan";
export { FanState } from "./Devices/Fan/FanState";
export { Keypad } from "./Devices/Keypad/Keypad";
export { KeypadState } from "./Devices/Keypad/KeypadState";
export { Occupancy } from "./Devices/Occupancy/Occupancy";
export { OccupancyState } from "./Devices/Occupancy/OccupancyState";
export { Remote } from "./Devices/Remote/Remote";
export { Shade } from "./Devices/Shade/Shade";
export { ShadeState } from "./Devices/Shade/ShadeState";
export { Strip } from "./Devices/Strip/Strip";
export { StripState } from "./Devices/Strip/StripState";
export { Switch } from "./Devices/Switch/Switch";
export { SwitchState } from "./Devices/Switch/SwitchState";
export { Timeclock } from "./Devices/Timeclock/Timeclock";
export { TimeclockState } from "./Devices/Timeclock/TimeclockState";
export { Unknown } from "./Devices/Unknown/Unknown";
/**
 * Establishes a connection to all paired devices.
 *
 * @param refresh (optional) Setting this to true will not load devices from
 *                cache.
 *
 * @returns A reference to the location with all processors.
 * @public
 */
export declare function connect(refresh?: boolean): Client;
/**
 * Starts listening for pairing commands from processors.
 * @public
 */
export declare function pair(): Promise<void>;
export { Client };
//# sourceMappingURL=index.d.ts.map