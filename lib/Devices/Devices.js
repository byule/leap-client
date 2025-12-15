"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAddressable = exports.parseDeviceType = exports.createDevice = void 0;
const hap_device_1 = require("@mkellsy/hap-device");
const ContactController_1 = require("./Contact/ContactController");
const DimmerController_1 = require("./Dimmer/DimmerController");
const FanController_1 = require("./Fan/FanController");
const KeypadController_1 = require("./Keypad/KeypadController");
const RemoteController_1 = require("./Remote/RemoteController");
const OccupancyController_1 = require("./Occupancy/OccupancyController");
const ShadeController_1 = require("./Shade/ShadeController");
const StripController_1 = require("./Strip/StripController");
const SwitchController_1 = require("./Switch/SwitchController");
const TimeclockController_1 = require("./Timeclock/TimeclockController");
const UnknownController_1 = require("./Unknown/UnknownController");
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
function createDevice(processor, area, definition) {
    var _a;
    const type = parseDeviceType(definition.ControlType || definition.DeviceType);
    switch (type) {
        case hap_device_1.DeviceType.Contact:
            return new ContactController_1.ContactController(processor, area, definition);
        case hap_device_1.DeviceType.Dimmer:
            return new DimmerController_1.DimmerController(processor, area, definition);
        case hap_device_1.DeviceType.Fan:
            return new FanController_1.FanController(processor, area, definition);
        case hap_device_1.DeviceType.Keypad:
            return new KeypadController_1.KeypadController(processor, area, definition);
        case hap_device_1.DeviceType.Occupancy:
            return new OccupancyController_1.OccupancyController(processor, area, {
                href: `/occupancy/${(_a = area.href) === null || _a === void 0 ? void 0 : _a.split("/")[2]}`,
                Name: definition.Name,
            });
        case hap_device_1.DeviceType.Remote:
            return new RemoteController_1.RemoteController(processor, area, definition);
        case hap_device_1.DeviceType.Shade:
            return new ShadeController_1.ShadeController(processor, area, definition);
        case hap_device_1.DeviceType.Strip:
            return new StripController_1.StripController(processor, area, definition);
        case hap_device_1.DeviceType.Switch:
            return new SwitchController_1.SwitchController(processor, area, definition);
        case hap_device_1.DeviceType.Timeclock:
            return new TimeclockController_1.TimeclockController(processor, area, definition);
        default:
            return new UnknownController_1.UnknownController(processor, area, definition);
    }
}
exports.createDevice = createDevice;
/**
 * Parses a string to a standard device type enum value.
 *
 * @param value A string device type from the processor.
 *
 * @returns A standard device type from the device type enum.
 * @private
 */
function parseDeviceType(value) {
    switch (value) {
        case "Switched":
        case "PowPakSwitch":
        case "OutdoorPlugInSwitch":
            return hap_device_1.DeviceType.Switch;
        case "Dimmed":
        case "PlugInDimmer":
            return hap_device_1.DeviceType.Dimmer;
        case "Shade":
            return hap_device_1.DeviceType.Shade;
        case "Timeclock":
            return hap_device_1.DeviceType.Timeclock;
        case "WhiteTune":
            return hap_device_1.DeviceType.Strip;
        case "FanSpeed":
            return hap_device_1.DeviceType.Fan;
        case "Pico2Button":
        case "Pico3Button":
        case "Pico4Button":
        case "Pico3ButtonRaiseLower":
            return hap_device_1.DeviceType.Remote;
        case "SunnataDimmer":
        case "SunnataSwitch":
        case "SunnataKeypad":
        case "SunnataHybridKeypad":
        case "PalladiomKeypad":
            return hap_device_1.DeviceType.Keypad;
        case "RPSCeilingMountedOccupancySensor":
            return hap_device_1.DeviceType.Occupancy;
        case "CCO":
            return hap_device_1.DeviceType.Contact;
        default:
            return hap_device_1.DeviceType.Unknown;
    }
}
exports.parseDeviceType = parseDeviceType;
/**
 * Determines if the device is addressable. Basically can we program actions
 * for it.
 *
 * @param device A reference to the device.
 *
 * @returns True is addressable, false if not.
 * @private
 */
function isAddressable(device) {
    if (device.AddressedState !== "Addressed") {
        return false;
    }
    switch (device.DeviceType) {
        case "Pico2Button":
        case "Pico3Button":
        case "Pico4Button":
        case "Pico3ButtonRaiseLower":
            return true;
        case "SunnataKeypad":
        case "SunnataHybridKeypad":
        case "PalladiomKeypad":
            return true;
        case "RPSCeilingMountedOccupancySensor":
            return true;
        default:
            return false;
    }
}
exports.isAddressable = isAddressable;
