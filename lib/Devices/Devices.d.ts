import { Device, DeviceType } from "@mkellsy/hap-device";
import { AreaAddress } from "../Response/AreaAddress";
import { DeviceAddress } from "../Response/DeviceAddress";
import { Processor } from "./Processor/Processor";
/**
 * Creates a device by type. This is a device factory.
 *
 * @param processor A reference to the processor.
 * @param area A reference to the area.
 * @param definition Device definition, this is either an area, zone or device.
 *
 * @returns A common device object. Casting will be needed to access extended
 *          capibilities.
 * @private
 */
export declare function createDevice(processor: Processor, area: AreaAddress, definition: unknown): Device;
/**
 * Parses a string to a standard device type enum value.
 *
 * @param value A string device type from the processor.
 *
 * @returns A standard device type from the device type enum.
 * @private
 */
export declare function parseDeviceType(value: string): DeviceType;
/**
 * Determines if the device is addressable. Basically can we program actions
 * for it.
 *
 * @param device A reference to the device.
 *
 * @returns True is addressable, false if not.
 * @private
 */
export declare function isAddressable(device: DeviceAddress): boolean;
//# sourceMappingURL=Devices.d.ts.map