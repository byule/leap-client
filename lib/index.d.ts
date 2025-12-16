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

/// <reference types="node" />

import { Action } from '@mkellsy/hap-device';
import { Address as Address_2 } from '@mkellsy/hap-device';
import { AreaStatus as AreaStatus_2 } from '@mkellsy/hap-device';
import { Button } from '@mkellsy/hap-device';
import { Contact as Contact_2 } from '@mkellsy/hap-device';
import { Device } from '@mkellsy/hap-device';
import { DeviceState } from '@mkellsy/hap-device';
import { Dimmer as Dimmer_2 } from '@mkellsy/hap-device';
import { EventEmitter } from '@mkellsy/event-emitter';
import { Fan as Fan_2 } from '@mkellsy/hap-device';
import { ILogger } from 'js-logger';
import { Keypad as Keypad_2 } from '@mkellsy/hap-device';
import { Occupancy as Occupancy_2 } from '@mkellsy/hap-device';
import { pki } from 'node-forge';
import { Remote as Remote_2 } from '@mkellsy/hap-device';
import { Shade as Shade_2 } from '@mkellsy/hap-device';
import { Strip as Strip_2 } from '@mkellsy/hap-device';
import { Switch as Switch_2 } from '@mkellsy/hap-device';
import { Timeclock as Timeclock_2 } from '@mkellsy/hap-device';
import { TimeclockStatus as TimeclockStatus_2 } from '@mkellsy/hap-device';
import { Unknown as Unknown_2 } from '@mkellsy/hap-device';
import { ZoneStatus as ZoneStatus_2 } from '@mkellsy/hap-device';

/**
 * A device address.
 * @private
 */
declare type Address = {
    /**
     * The device href.
     */
    href: string;
};

/**
 * A device's tooggle properties (extended)
 * @private
 */
declare type AdvancedToggleProperties = {
    /**
     * Primary preset.
     */
    PrimaryPreset: Address;
    /**
     * Secondary preset.
     */
    SecondaryPreset: Address;
};

/**
 * List of zones assigned to a button group.
 * @private
 */
declare type AffectedZone = Address & {
    /**
     * Button group.
     */
    ButtonGroup: ButtonGroup;
    /**
     * Assigned zone.
     */
    Zone: ZoneAddress;
};

/**
 * Represents an area and contains a list of zones, control stations, and
 * sensors.
 * @private
 */
declare type AreaAddress = Address & {
    /**
     * Area name.
     */
    Name: string;
    /**
     * Area's control type.
     */
    ControlType: string;
    /**
     * Area's parent node.
     */
    Parent: Address;
    /**
     * Is this area a leaf, meaning there are no child areas.
     */
    IsLeaf: boolean;
    /**
     * List of zones in this area.
     */
    AssociatedZones: Address[];
    /**
     * List of control stations in this area.
     */
    AssociatedControlStations: Address[];
    /**
     * List of sensors in this area.
     */
    AssociatedOccupancyGroups: Address[];
};

/**
 * Defines a scene for an area.
 * @private
 */
declare type AreaScene = Address & {
    /**
     * Scene name.
     */
    Name: string;
    /**
     * The parent node this scene belongs to.
     */
    Parent: Address;
    /**
     * Scene primary preset.
     */
    Preset: Address;
    /**
     * Scene order amongst others.
     */
    SortOrder: number;
};

/**
 * An area status.
 * @private
 */
declare type AreaStatus = Address & {
    /**
     * Brightness level.
     */
    Level: number;
    /**
     * Occupancy status.
     */
    OccupancyStatus: string;
    /**
     * Area's current scene.
     */
    CurrentScene: Address;
};

/**
 * Area association.
 * @private
 */
declare type AssociatedArea = Address & {
    /**
     * Area address.
     */
    Area: Address;
};

/**
 * Sensor association.
 * @private
 */
declare type AssociatedSensor = Address & {
    /**
     * Sensor address.
     */
    OccupancySensor: Address;
};

/**
 * Authentication response.
 * @private
 */
declare interface Authentication {
    /**
     * Request results
     */
    SigningResult: {
        /**
         * Root certificate
         */
        RootCertificate: string;
        /**
         * Auth Certificate
         */
        Certificate: string;
    };
}

declare namespace Body_2 {
    export {
        BodyType
    }
}

/**
 * Response body types
 * @private
 */
declare type BodyType = AreaAddress | AreaAddress[] | AreaScene | AreaScene[] | AreaStatus | AreaStatus[] | Authentication | ButtonAddress | ButtonAddress[] | ButtonGroup | ButtonGroup[] | ButtonGroupExpanded | ButtonGroupExpanded[] | ButtonStatus | ButtonStatus[] | ClientSetting | ClientSetting[] | ControlStation | ControlStation[] | DeviceAddress | DeviceAddress[] | DeviceStatus | DeviceStatus[] | DimmedLevelAssignment | DimmedLevelAssignment[] | ExceptionDetail | ExceptionDetail[] | FanSpeedAssignment | FanSpeedAssignment[] | LinkNode | LinkNode[] | OccupancyGroup | OccupancyGroup[] | OccupancyGroupStatus | OccupancyGroupStatus[] | PhysicalAccess | PingResponse | PingResponse[] | Preset | Preset[] | PresetAssignment | PresetAssignment[] | ProgrammingModel | ProgrammingModel[] | Project | Project[] | TiltAssignment | TiltAssignment[] | TimeclockAddress | TimeclockAddress[] | TimeclockStatus | TimeclockStatus[] | VirtualButton | VirtualButton[] | ZoneAddress | ZoneAddress[] | ZoneStatus | ZoneStatus[];

/**
 * Defines a keypad button.
 * @private
 */
declare type ButtonAddress = Address & {
    /**
     * Associated led address.
     */
    AssociatedLED: Address;
    /**
     * Button number on the keypad.
     */
    ButtonNumber: number;
    /**
     * Custom engraving, configured name.
     */
    Engraving: {
        Text: string;
    };
    /**
     * Configured name.
     */
    Name: string;
    /**
     * Parent node address.
     */
    Parent: Address;
    /**
     * Button's programming model.
     */
    ProgrammingModel: ProgrammingModel;
};

/**
 * Configuration for individual button trigger behavior
 */
declare interface ButtonConfig {
    /**
     * Specifies which hardware event(s) trigger button actions.
     * - 'press': Only Press events trigger actions
     * - 'release': Only Release events trigger actions (default)
     * - 'pressAndRelease': Both Press and Release events are used for full state machine
     */
    triggerOn?: "press" | "release" | "pressAndRelease";
}

/**
 * Defines a group of buttons.
 * @private
 */
declare type ButtonGroup = Address & {
    /**
     * Zones assigned to the buttons.
     */
    AffectedZones: AffectedZone[];
    /**
     * List of buttons.
     */
    Buttons: Address[];
    /**
     * Parent node address.
     */
    Parent: DeviceAddress;
    /**
     * Button group programming type.
     */
    ProgrammingType: string;
    /**
     * Order of group amongst others.
     */
    SortOrder: number;
    /**
     * Special property to stop listening to the button if assicoated zone is
     * in motion.
     */
    StopIfMoving: string;
};

/**
 * Defines a group of buttons (extended)
 * @private
 */
declare type ButtonGroupExpanded = Address & {
    /**
     * Zones assigned to the buttons.
     */
    AffectedZones: AffectedZone[];
    /**
     * List of buttons.
     */
    Buttons: ButtonAddress[];
    /**
     * Parent node address.
     */
    Parent: DeviceAddress;
    /**
     * Button group programming type.
     */
    ProgrammingType: string;
    /**
     * Order of group amongst others.
     */
    SortOrder: number;
    /**
     * Special property to stop listening to the button if assicoated zone is
     * in motion.
     */
    StopIfMoving: string;
};

/**
 * Defines a button action status.
 * @private
 */
declare type ButtonStatus = Address & {
    /**
     * Button address.
     */
    Button: Address;
    /**
     * Button event, press, release, and long hold.
     */
    ButtonEvent: {
        EventType: "Press" | "Release" | "LongHold";
    };
};

/**
 * Defines a catagory of devices.
 * @private
 */
declare type Category = {
    /**
     * Device type.
     */
    Type: string;
    /**
     * Device sub-type.
     */
    SubType: string;
    /**
     * Is this device a light.
     */
    IsLight: boolean;
};

/**
 * Defines an auth certificate.
 * @private
 */
declare interface Certificate {
    /**
     * Certificate authority.
     */
    ca: string;
    /**
     * Certificate public key.
     */
    key: string;
    /**
     * Certificate contents.
     */
    cert: string;
}

/**
 * Defines a certificate request.
 * @private
 */
declare interface CertificateRequest {
    /**
     * Certificate private key.
     */
    key: pki.rsa.PrivateKey;
    /**
     * Certificate contents.
     */
    cert: string;
}

/**
 * Creates an object that represents a single location, with a single network.
 * @public
 */
export declare class Client extends EventEmitter<{
    Action: (device: Device, button: Button, action: Action) => void;
    Available: (devices: Device[]) => void;
    Message: (response: Response) => void;
    Update: (device: Device, state: DeviceState) => void;
}> {
    private context;
    private refresh;
    private config;
    private discovery;
    private discovered;
    /**
     * Creates a location object and starts mDNS discovery.
     *
     * ```js
     * const location = new Client();
     *
     * location.on("Avaliable", (devices: Device[]) => {  });
     * ```
     *
     * @param refresh If true, this will ignore any cache and reload.
     * @param config Configuration for button behavior and other settings.
     */
    constructor(refresh?: boolean, config?: LeapConfig);
    /**
     * A list of processors in this location.
     *
     * @returns A string array of processor ids.
     */
    get processors(): string[];
    /**
     * Fetch a processor from this location.
     *
     * @param id The processor id to fetch.
     *
     * @returns A processor object or undefined if it doesn't exist.
     */
    processor(id: string): Processor | undefined;
    /**
     * Closes all connections for a location and stops searching.
     */
    close(): void;
    private discoverZones;
    private discoverTimeclocks;
    private discoverControls;
    private discoverPositions;
    private onDiscovered;
    private onDeviceUpdate;
    private onDeviceAction;
    private onProcessorError;
}

/**
 * Defines a processor client settings.
 * @private
 */
declare type ClientSetting = Address & {
    /**
     * Client major version.
     */
    ClientMajorVersion: number;
    /**
     * Client minor version.
     */
    ClientMinorVersion: number;
    /**
     * Client permission and role.
     */
    Permissions: {
        SessionRole: string;
    };
};

/**
 * Establishes a connection to all paired devices.
 *
 * @param refresh (optional) Setting this to true will not load devices from
 *                cache.
 * @param config (optional) Configuration for button behavior and other settings.
 *
 * @returns A reference to the location with all processors.
 * @public
 */
export declare function connect(refresh?: boolean, config?: LeapConfig): Client;

/**
 * Connects to a device with the provided secure host.
 * @private
 */
declare class Connection extends Parser<{
    Connect: (protocol: string) => void;
    Disconnect: () => void;
    Response: (response: Response_2) => void;
    Message: (response: Response_2) => void;
    Error: (error: Error) => void;
}> {
    private socket?;
    private secure;
    private teardown;
    private host;
    private certificate;
    private requests;
    private subscriptions;
    /**
     * Creates a new connection to a device.
     *
     * ```js
     * const connection = new Connection("192.168.1.1", { ca, key, cert });
     * ```
     *
     * @param host The ip address of the device.
     * @param certificate Authentication certificate.
     */
    constructor(host: string, certificate?: Certificate);
    /**
     * Detects if a host is reachable.
     *
     * @param host Address of the device.
     *
     * @returns True if the device is rechable, false if not.
     */
    static reachable(host: string): Promise<boolean>;
    /**
     * Asyncronously connects to a device.
     *
     * ```js
     * await connection.connect();
     * ```
     */
    connect(): Promise<void>;
    /**
     * Disconnects from a device.
     *
     * ```js
     * connection.disconnect();
     * ```
     */
    disconnect(): void;
    /**
     * Fetches a record from the device. Not this only works for a secure
     * connections.
     *
     * ```js
     * const record = await connection.read<Zone>("/zone/123456");
     * ```
     *
     * @param url The url of the record, this is typically a device address.
     *
     * @returns A payload or rejects. The payload is typed per call.
     */
    read<T>(url: string): Promise<T>;
    /**
     * This sends an authentication request. This only works for non-secure
     * connections.
     *
     * ```js
     * const certificate = await connection.authenticate(csr);
     * ```
     *
     * @param csr Sends a certificate request, typically created with open ssl.
     *
     * @returns An authentication certificate or rejects if failed.
     */
    authenticate(csr: CertificateRequest): Promise<Certificate>;
    /**
     * Sends a commend to update a device. This only works for secure
     * connections.
     *
     * ```js
     * await connection.update("/zone/123456", state);
     * ```
     *
     * @param url A command url typically the href of a device.
     * @param body An object of values to update.
     *
     * @returns Returns a status paylod. The type is set per call.
     */
    update<T>(url: string, body: Record<string, unknown>): Promise<T>;
    /**
     * Sends a known command to the device. This only works for secure
     * connections.
     *
     * ```js
     * await connection.command("/zone/123456", command);
     * ```
     *
     * @param url A command url typically the href of a device.
     * @param command A known command object.
     */
    command(url: string, command: Record<string, unknown>): Promise<void>;
    /**
     * Subscribes to a record on the device. This will bind a listener to that
     * record that will get called every time the record changes. This is
     * helpful for keeping track of the status of an area, zone, or device.
     * This only works for secure connections.
     *
     * ```js
     * connection.subscribe("/zone/123456/status", (response) => { });
     * ```
     *
     * @param url Url to subscribe to.
     * @param listener Callback to run when the record updates.
     */
    subscribe<T>(url: string, listener: (response: T) => void): Promise<void>;
    private drainRequests;
    private sendRequest;
    private onResponse;
    private onSocketData;
    private onSocketDisconnect;
    private onSocketError;
    private authorityCertificate;
    private physicalAccess;
}

/**
 * Defines a CCO device.
 * @public
 */
export declare interface Contact extends Contact_2 {
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
    update(status: ZoneStatus_2): void;
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
    /**
     * The current state of the device.
     *
     * @returns The device's state.
     */
    readonly status: ContactState;
}

/**
 * Defines a CCO's current status response.
 * @public
 */
export declare interface ContactState extends DeviceState {
    /**
     * Is the contact closed or open.
     */
    state: "Closed" | "Open";
}

/**
 * Defines a control station.
 * @private
 */
declare type ControlStation = Address & {
    /**
     * Control station name.
     */
    Name: string;
    /**
     * Control station control type.
     */
    ControlType: string;
    /**
     * PArent node address.
     */
    Parent: Address;
    /**
     * Area this control station is assigned to.
     */
    AssociatedArea: Address;
    /**
     * Sort order amongst others.
     */
    SortOrder: number;
    /**
     * List of assigned devices (keypads, pico remotes).
     */
    AssociatedGangedDevices: {
        Device: DeviceAddress;
    }[];
};

/**
 * Defines a device.
 * @private
 */
declare type DeviceAddress = Address & {
    /**
     * The device name.
     */
    Name: string;
    /**
     * Parent node address.
     */
    Parent: Address;
    /**
     * Device serial number.
     */
    SerialNumber: string;
    /**
     * Device model number.
     */
    ModelNumber: string;
    /**
     * DEvice type.
     */
    DeviceType: string;
    /**
     * List of button groups.
     */
    ButtonGroups: Address[];
    /**
     * List of local zones.
     */
    LocalZones: Address[];
    /**
     * Area this device belongs to.
     */
    AssociatedArea: Address;
    /**
     * List of sensors.
     */
    OccupancySensors: Address[];
    /**
     * List of linked node addresses.
     */
    LinkNodes: Address[];
    /**
     * List of device rules.
     */
    DeviceRules: Address[];
    /**
     * Device's repeater properties (if supported).
     */
    RepeaterProperties: {
        /**
         * Is this device a repeater.
         */
        IsRepeater: boolean;
    };
    /**
     * Devices firmware information.
     */
    FirmwareImage: {
        /**
         * Devices firmware.
         */
        Firmware: {
            /**
             * Firmware name.
             */
            DisplayName: string;
        };
        /**
         * Currently installed firmware.
         */
        Installed: {
            /**
             * Year installed.
             */
            Year: number;
            /**
             * Month installed.
             */
            Month: number;
            /**
             * Day installed.
             */
            Day: number;
            /**
             * Hour installed.
             */
            Hour: number;
            /**
             * Minute installed.
             */
            Minute: number;
            /**
             * Second installed.
             */
            Second: number;
            /**
             * UTC date and time installed.
             */
            Utc: string;
        };
    };
    /**
     * Is this device addressed.
     */
    AddressedState?: "Addressed" | "Unaddressed" | "Unknown";
    /**
     * Is the device an actual device.
     */
    IsThisDevice?: boolean;
};

/**
 * Device discovered response.
 * @private
 */
declare type DeviceHeard = {
    /**
     * How was this device discovered.
     */
    DiscoveryMechanism: "UserInteraction" | "UnassociatedDeviceDiscovery" | "Unknown";
    /**
     * Device serial number.
     */
    SerialNumber: string;
    /**
     * Device type.
     */
    DeviceType: string;
    /**
     * Device model number.
     */
    ModelNumber: string;
};

/**
 * Device discovery status.
 * @private
 */
declare type DeviceStatus = Address & {
    /**
     * Device discovery response.
     */
    DeviceHeard: DeviceHeard;
};

/**
 * Dimmed level assignment.
 * @private
 */
declare type DimmedLevelAssignment = Address & {
    /**
     * Device, area, or zone address.
     */
    AssignableResource: Address;
    /**
     * Delay time.
     */
    DelayTime: string;
    /**
     * Fade duration from previous assignment.
     */
    FadeTime: string;
    /**
     * Target brightness level.
     */
    Level: number;
    /**
     * Parent node address.
     */
    Parent: Address;
};

/**
 * Defines a dimmable light device.
 * @public
 */
export declare interface Dimmer extends Dimmer_2 {
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
    update(status: ZoneStatus_2): void;
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
    /**
     * The current state of the device.
     *
     * @returns The device's state.
     */
    readonly status: DimmerState;
}

/**
 * Defines a dimmer's current status response.
 * @public
 */
export declare interface DimmerState extends DeviceState {
    /**
     * Is the dimmer on or off.
     */
    state: "On" | "Off";
    /**
     * The dimmer's brightness level.
     */
    level: number;
}

/**
 * Dual action scene properties.
 * @private
 */
declare type DualActionProperties = {
    /**
     * Preset address.
     */
    PressPreset: Address;
    /**
     * Preset address for the button release.
     */
    ReleasePreset: Address;
};

/**
 * Exception response.
 * @private
 */
declare class ExceptionDetail {
    /**
     * Responce message.
     */
    Message: string;
}

/**
 * Defines a fan device.
 * @public
 */
export declare interface Fan extends Fan_2 {
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
    update(status: ZoneStatus_2): void;
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
    /**
     * The current state of the device.
     *
     * @returns The device's state.
     */
    readonly status: FanState;
}

/**
 * Fan speed assignement request.
 * @private
 */
declare type FanSpeedAssignment = Address & {
    /**
     * Device, arfea, or zone address.
     */
    AssignableResource: Address;
    /**
     * Delay time.
     */
    DelayTime: string;
    /**
     * Parent node address.
     */
    Parent: Address;
    /**
     * Target speed.
     */
    Speed: string;
};

/**
 * Available fan speed levels.
 * @private
 */
declare type FanSpeedType = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;

/**
 * Defines a fan's current status response.
 * @public
 */
export declare interface FanState extends DeviceState {
    /**
     * Is the fan on, off, or set to auto.
     */
    state: "On" | "Off";
    /**
     * The fan's speed setting.
     */
    speed: number;
}

/**
 * Defines a keypad device.
 * @public
 */
export declare interface Keypad extends Keypad_2 {
    readonly buttons: Button[];
    /**
     * Waits for async initialization to complete (button loading).
     *
     * @returns A promise that resolves when the device is fully initialized.
     */
    initialize(): Promise<void>;
    /**
     * Controls this LEDs on this device.
     *
     * ```js
     * keypad.set({ state: { href: "/led/123456" }, state: "On" });
     * ```
     *
     * @param status Desired device state.
     */
    set(status: KeypadState): Promise<void>;
    /**
     * The current state of the device.
     *
     * @returns The device's state.
     */
    readonly status: KeypadState;
}

/**
 * Defines a keypad's LED current status response.
 * @public
 */
export declare interface KeypadState extends DeviceState {
    /**
     * Is the LED on or off.
     */
    state: "On" | "Off";
    /**
     * The address of the LED on the keypad.
     */
    led: Address_2;
}

/**
 * Configuration for the leap-client
 */
declare interface LeapConfig {
    /**
     * Button-specific configuration mapped by button name
     * Example: { "Goodbye": { "triggerOn": "press" } }
     */
    buttonConfig?: {
        [buttonName: string]: ButtonConfig;
    };
}

/**
 * Defines a device's linked nodes.
 * @private
 */
declare type LinkNode = Address & {
    /**
     * Parent node address.
     */
    Parent: Address;
    /**
     * Link type.
     */
    LinkType: string;
    /**
     * Order amongst others.
     */
    SortOrder: number;
    /**
     * Associated link node.
     */
    AssociatedLink: Address;
    /**
     * X-Link properties.
     */
    ClearConnectTypeXLinkProperties: {
        /**
         * Pan ID.
         */
        PANID: number;
        /**
         * Pan ID (extended).
         */
        ExtendedPANID: string;
        /**
         * Channel number of the device.
         */
        Channel: number;
        /**
         * Network name.
         */
        NetworkName: string;
        /**
         * Network security key.
         */
        NetworkMasterKey: string;
    };
};

/**
 * Defines the available message types.
 * @private
 */
declare type MessageType = "OneProjectDefinition" | "OnePresetDefinition" | "OneAreaSceneDefinition" | "OneLinkDefinition" | "OneLinkNodeDefinition" | "MultipleLinkNodeDefinition" | "MultipleLinkDefinition" | "OneControlStationDefinition" | "MultipleControlStationDefinition" | "OneAreaDefinition" | "MultipleAreaDefinition" | "OneAreaStatus" | "MultipleAreaStatus" | "OneDeviceStatus" | "OneDeviceDefinition" | "MultipleDeviceDefinition" | "OneZoneDefinition" | "MultipleZoneDefinition" | "OneZoneStatus" | "MultipleZoneStatus" | "OnePingResponse" | "OneButtonGroupDefinition" | "MultipleButtonGroupDefinition" | "MultipleButtonGroupExpandedDefinition" | "OneButtonDefinition" | "OneButtonStatusEvent" | "MultipleOccupancyGroupStatus" | "OneOccupancyGroupDefinition" | "OneClientSettingDefinition" | "MultipleVirtualButtonDefinition" | "OneVirtualButtonDefinition" | "OneProgrammingModelDefinition" | "OnePresetAssignmentDefinition" | "OneDimmedLevelAssignmentDefinition" | "OneFanSpeedAssignmentDefinition" | "OneTiltAssignmentDefinition" | "OneTimeclockStatus" | "MultipleTimeclockStatus" | "ExceptionDetail";

/**
 * Defines a occupancy sensor device.
 * @public
 */
export declare interface Occupancy extends Occupancy_2 {
    /**
     * Recieves a state response from the connection and updates the device
     * state.
     *
     * ```js
     * sensor.update({ OccupancyStatus: "Occupied" });
     * ```
     *
     * @param status The current device state.
     */
    update(status: AreaStatus_2): void;
    /**
     * The current state of the device.
     *
     * @returns The device's state.
     */
    readonly status: OccupancyState;
}

/**
 * Defines a group of occupancy sensors.
 * @private
 */
declare type OccupancyGroup = Address & {
    /**
     * Assigned area addresses.
     */
    AssociatedAreas?: AssociatedArea[];
    /**
     * Assigned sensor addresses.
     */
    AssociatedSensors?: AssociatedSensor[];
    /**
     * Sensor group programming model.
     */
    ProgrammingModel?: Address;
    /**
     * Sensor group programming type.
     */
    ProgrammingType?: string;
    /**
     * Sensor enabled/disabled schedule
     */
    OccupiedActionSchedule?: {
        ScheduleType: string;
    };
    /**
     * Sensor enabled/disabled schedule
     */
    UnoccupiedActionSchedule?: {
        ScheduleType: string;
    };
};

/**
 * Occupancy sensor status response.
 * @private
 */
declare type OccupancyGroupStatus = Address & {
    /**
     * Sensor group.
     */
    OccupancyGroup: OccupancyGroup;
    /**
     * Sensor status.
     */
    OccupancyStatus: OccupancyStatus;
};

/**
 * Defines an occupancy sensor's current status response.
 * @public
 */
export declare interface OccupancyState extends DeviceState {
    /**
     * Is the sensor detecting occupied or not.
     */
    state: "Occupied" | "Unoccupied";
}

/**
 * Occupancy status list.
 * @private
 */
declare type OccupancyStatus = "Occupied" | "Unoccupied" | "Unknown";

/**
 * Starts listening for pairing commands from processors.
 * @public
 */
export declare function pair(): Promise<void>;

/**
 * Enables response buffering.
 * @private
 */
declare class Parser<MAP extends {
    [key: string]: (...args: any[]) => void;
}> extends EventEmitter<MAP> {
    private buffer;
    /**
     * Parses a raw response, and returns via a callback.
     *
     * @param data Raw socket buffer.
     * @param callback Listener for complete response.
     */
    parse(data: Buffer, callback: (response: Response_2) => void): void;
}

/**
 * LED phase setting.
 * @private
 */
declare type PhaseSetting = Address & {
    /**
     * Phase direction.
     */
    Direction: string;
};

/**
 * Defines a physical address properties.
 * @private
 */
declare interface PhysicalAccess {
    /**
     * Address status.
     */
    Status: {
        /**
         * Permission list.
         */
        Permissions: unknown[];
    };
}

/**
 * Processor ping response.
 * @private
 */
declare type PingResponse = {
    /**
     * LEAP protocol version.
     */
    LEAPVersion: number;
};

/**
 * Defines a preset.
 * @private
 */
declare type Preset = Address & {
    /**
     * Preset name.
     */
    Name: string;
    /**
     * Parent node address.
     */
    Parent: Address;
    /**
     * Child preset assignment.
     */
    ChildPresetAssignment: PresetAssignment;
    /**
     * Current preset assignments.
     */
    PresetAssignments: Address[];
    /**
     * Assignements for fans.
     */
    FanSpeedAssignments: Address[];
    /**
     * Assignments for blinds.
     */
    TiltAssignments: Address[];
    /**
     * Assignments for dimmers.
     */
    DimmedLevelAssignments: Address[];
    /**
     * Assignments for favorites.
     */
    FavoriteCycleAssignments: Address[];
    /**
     * Assignments for track blinds.
     */
    NextTrackAssignments: Address[];
    /**
     * Assignments for sonos.
     */
    PauseAssignments: Address[];
    /**
     * Assignments for sonos.
     */
    PlayPauseToggleAssignments: Address[];
    /**
     * Assignments for track blinds.
     */
    RaiseLowerAssignments: Address[];
    /**
     * Assignments for track blinds.
     */
    ShadeLevelAssignments: Address[];
    /**
     * Assignments for sonos.
     */
    SonosPlayAssignments: Address[];
    /**
     * Assignments for switches.
     */
    SwitchedLevelAssignments: Address[];
    /**
     * Assignments for let strips.
     */
    WhiteTuningLevelAssignments: Address[];
};

/**
 * Assigns preset assignment types.
 * @private
 */
declare type PresetAssignment = Address & {
    /**
     * Assingned zone address.
     */
    AffectedZone?: ZoneAddress;
    /**
     * Action delay time.
     */
    Delay?: number;
    /**
     * Brightness fade time.
     */
    Fade?: number;
    /**
     * Brightness level.
     */
    Level?: number;
    /**
     * Preset name.
     */
    Name?: string;
    /**
     * Parent node address.
     */
    Parent?: Preset;
};

/**
 * Defines a LEAP processor. This could be a Caseta Smart Bridge, RA2/RA3
 * Processor, or a Homeworks Processor.
 * @public
 */
declare interface Processor extends EventEmitter<{
    Message: (response: Response_2) => void;
    Connect: (connection: Connection) => void;
    Disconnect: () => void;
}> {
    /**
     * The processor's unique identifier.
     *
     * @returns The processor id.
     */
    readonly id: string;
    /**
     * A logger for the processor. This will automatically print the
     * processor id.
     *
     * @returns A reference to the logger assigned to this processor.
     */
    readonly log: ILogger;
    /**
     * A device map for all devices found on this processor.
     *
     * @returns A device map by device id.
     */
    readonly devices: Map<string, Device>;
    /**
     * Connects to a processor.
     */
    connect(): Promise<void>;
    /**
     * Disconnects from a processor.
     */
    disconnect(): void;
    /**
     * Clears the processor's device cache.
     */
    clear(): void;
    /**
     * Pings the processor, useful for keeping the connection alive.
     *
     * @returns A ping response.
     */
    ping(): Promise<PingResponse>;
    /**
     * Sends a read command to the processor.
     *
     * @param url The url to read.
     * @returns A response object.
     */
    read<PAYLOAD = any>(url: string): Promise<PAYLOAD>;
    /**
     * Fetches the project information assigned to this processor.
     *
     * @returns A project object.
     */
    project(): Promise<Project>;
    /**
     * Fetches the processor's system information.
     *
     * @returns The processor as a device, or undefined if the processor
     *          doesn't support this.
     */
    system(): Promise<DeviceAddress | undefined>;
    /**
     * Fetches available areas. This represents floors, rooms, and suites.
     *
     * @returns An array of area objects.
     */
    areas(): Promise<AreaAddress[]>;
    /**
     * Fetches available timeclocks.
     *
     * @returns An array of timeclock objects.
     */
    timeclocks(): Promise<TimeclockAddress[]>;
    /**
     * Fetches available zones in an area. Zones represent a light and control.
     * In other systems this is the device.
     *
     * @param address The area to fetch zones.
     *
     * @returns An array of zone objects.
     */
    zones(address: Address): Promise<ZoneAddress[]>;
    /**
     * Fetches multiple status objects from an area or zone. Typically used to
     * fetch sensor states from an area.
     *
     * @param address Address of an area or zone.
     *
     * @returns A zone status object.
     */
    status(address: Address): Promise<ZoneStatus>;
    /**
     * Fetches available control stations of an area or zone. A control station
     * represents a group of keypads or remotes.
     *
     * @param address The address of an area or zone.
     *
     * @returns An array of control station objects.
     */
    controls(address: Address): Promise<ControlStation[]>;
    /**
     * Fetches a single device in a group. This represents a single keypad or
     * Pico remote.
     *
     * @param address An address of a group position.
     *
     * @returns A device object.
     */
    device(address: Address): Promise<DeviceAddress>;
    /**
     * Fetches available buttons on a device.
     *
     * @param address An address or a device.
     *
     * @returns An array of button group objects.
     */
    buttons(address: Address): Promise<ButtonGroupExpanded[]>;
    /**
     * Sends an updatre command to the processor.
     *
     * @param address The address of the record.
     * @param field The field to update.
     * @param value The value to set.
     */
    update(address: Address, field: string, value: object): Promise<void>;
    /**
     * Sends a structured command to the processor.
     *
     * @param address The address of the zone or device.
     * @param command The structured command object.
     */
    command(address: Address, command: object): Promise<void>;
    /**
     * Subscribes to record updates. This will call the listener every time the
     * record is updated.
     *
     * @param address The assress of the record.
     * @param listener The callback to call on updates.
     */
    subscribe<T>(address: Address, listener: (response: T) => void): Promise<void>;
}

/**
 * Defines a programming model.
 * @private
 */
declare type ProgrammingModel = Address & {
    /**
     * Assigned toggle properties.
     */
    AdvancedToggleProperties: AdvancedToggleProperties;
    /**
     * Assigned dual action properties.
     */
    DualActionProperties: DualActionProperties;
    /**
     * Model name.
     */
    Name: string;
    /**
     * Parent node address.
     */
    Parent: Address;
    /**
     * Preset address.
     */
    Preset: Address;
    /**
     * Programming model type.
     */
    ProgrammingModelType: ProgrammingModelType;
};

/**
 * Available programming mode types.
 * @private
 */
declare type ProgrammingModelType = "SingleActionProgrammingModel" | "SingleSceneRaiseProgrammingModel" | "DualActionProgrammingModel" | "AdvancedToggleProgrammingModel" | "AdvancedConditionalProgrammingModel" | "SingleSceneLowerProgrammingModel" | "SimpleConditionalProgrammingModel" | "OpenStopCloseStopProgrammingModel" | "Unknown";

/**
 * Defines a project on a processor.
 * @private
 */
declare type Project = Address & {
    /**
     * Project name.
     */
    Name: string;
    /**
     * Control type.
     */
    ControlType: string;
    /**
     * Product type.
     */
    ProductType: string;
    /**
     * Project contact list.
     */
    Contacts: Address[];
    /**
     * Timeclock event rules.
     */
    TimeclockEventRules: Address;
    /**
     * Last modification date.
     */
    ProjectModifiedTimestamp: {
        /**
         * Year modified.
         */
        Year: number;
        /**
         * Month modified.
         */
        Month: number;
        /**
         * Day modified.
         */
        Day: number;
        /**
         * Hour modified.
         */
        Hour: number;
        /**
         * Minute modified.
         */
        Minute: number;
        /**
         * Second modified.
         */
        Second: number;
        /**
         * UTC date and time modified.
         */
        Utc: "string";
    };
};

/**
 * Defines a Pico remote device.
 * @public
 */
export declare interface Remote extends Remote_2 {
    readonly buttons: Button[];
    /**
     * Waits for async initialization to complete (button loading).
     *
     * @returns A promise that resolves when the device is fully initialized.
     */
    initialize(): Promise<void>;
}

/**
 * List of available request types.
 * @private
 */
declare type RequestType = "CreateRequest" | "CreateResponse" | "DeleteRequest" | "DeleteResponse" | "ExceptionResponse" | "MetadataRequest" | "MetadataResponse" | "ReadRequest" | "ReadResponse" | "SubscribeRequest" | "SubscribeResponse" | "UnsubscribeRequest" | "UnsubscribeResponse" | "UpdateRequest" | "UpdateResponse";

/**
 * Defines a processor response.
 * @private
 */
declare class Response_2 {
    CommuniqueType?: RequestType;
    Body?: Body_2.BodyType;
    Header: ResponseHeader;
    /**
     * Creates a new response object.
     */
    constructor();
    /**
     * Parses complete responses to a response object.
     *
     * @param value The assembled response.
     *
     * @returns Returns a response object.
     */
    static parse(value: string): Response_2;
}

/**
 * Creates a response header object.
 * @private
 */
declare class ResponseHeader {
    StatusCode?: ResponseStatus;
    Url?: string;
    MessageBodyType?: MessageType;
    ClientTag?: string;
}

/**
 * Creates a response status object.
 * @private
 */
declare class ResponseStatus {
    /**
     * Status message
     */
    message?: string;
    /**
     * Status code
     */
    code?: number;
    /**
     * Creates a response status object.
     *
     * @param message Complete response.
     * @param code Response code from the message.
     */
    constructor(message?: string, code?: number);
    /**
     * Creates a response status object from a string.
     *
     * @param value Status string.
     *
     * @returns A response status object.
     */
    static fromString(value?: string): ResponseStatus;
    /**
     * Is the status successful.
     *
     * @returns True if successful, false if not.
     */
    isSuccessful(): boolean;
}

/**
 * Defines a window shade device.
 * @public
 */
export declare interface Shade extends Shade_2 {
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
    update(status: ZoneStatus_2): void;
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
    /**
     * The current state of the device.
     *
     * @returns The device's state.
     */
    readonly status: ShadeState;
}

/**
 * Defines a shade's current status response.
 * @public
 */
export declare interface ShadeState extends DeviceState {
    /**
     * Is the shade open or closed.
     */
    state: "Open" | "Closed";
    /**
     * The shade's open level.
     */
    level: number;
    /**
     * The shade's tilt level.
     */
    tilt?: number;
}

/**
 * Defines a LED strip device.
 * @public
 */
export declare interface Strip extends Strip_2 {
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
    update(status: ZoneStatus_2): void;
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
    /**
     * The current state of the device.
     *
     * @returns The device's state.
     */
    readonly status: StripState;
}

/**
 * Defines a LED strip's current status response.
 * @public
 */
export declare interface StripState extends DeviceState {
    /**
     * Is the LED strip on or off.
     */
    state: "On" | "Off";
    /**
     * The LED strip's brightness level.
     */
    level: number;
    /**
     * The LED's color temperature luminance.
     */
    luminance: number;
}

/**
 * Defines a on/off switch device.
 * @public
 */
export declare interface Switch extends Switch_2 {
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
    update(status: ZoneStatus_2): void;
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
    /**
     * The current state of the device.
     *
     * @returns The device's state.
     */
    readonly status: SwitchState;
}

/**
 * Defines a switch's current status response.
 * @public
 */
export declare interface SwitchState extends DeviceState {
    /**
     * Is the switch on or off.
     */
    state: "On" | "Off";
}

/**
 * Defines a blind tilt update object.
 * @private
 */
declare type TiltAssignment = Address & {
    /**
     * Parent node address.
     */
    Parent: Address;
    /**
     * Assigned resource address.
     */
    AssignableResource: Address;
    /**
     * Delay time.
     */
    DelayTime: string;
    /**
     * Target tilt assignment.
     */
    Tilt: number;
};

/**
 * Defines a timeclock device.
 * @public
 */
export declare interface Timeclock extends Timeclock_2 {
    /**
     * Recieves a state response from the connection and updates the device
     * state.
     *
     * ```js
     * timeclock.update({ EnabledState: "Enabled" });
     * ```
     *
     * @param status The current device state.
     */
    update(status: TimeclockStatus_2): void;
    /**
     * The current state of the device.
     *
     * @returns The device's state.
     */
    readonly status: TimeclockState;
}

/**
 * Defines a timeclock.
 * @private
 */
declare type TimeclockAddress = Address & {
    /**
     * Timeclock name.
     */
    Name: string;
    /**
     * Parent node address.
     */
    Parent: Address;
};

/**
 * Defines a timeclock's current status response.
 * @public
 */
export declare interface TimeclockState extends DeviceState {
    /**
     * Is the timeclock enabled or disabled.
     */
    state: "On" | "Off";
}

/**
 * Defines a timeclock status.
 * @private
 */
declare type TimeclockStatus = Address & {
    /**
     * Associated timeclock address.
     */
    Timeclock: Address;
    /**
     * Is the timeclock enabled.
     */
    EnabledState: string;
};

/**
 * Defines trim tuning setting.
 * @private
 */
declare type TuningSetting = Address & {
    /**
     * Level max.
     */
    HighEndTrim: number;
    /**
     * Level min.
     */
    LowEndTrim: number;
};

/**
 * Defines an unknown device.
 * @public
 */
export declare interface Unknown extends Unknown_2 {
}

/**
 * Defines a virtual button.
 * @private
 */
declare type VirtualButton = Address & {
    /**
     * Button number.
     */
    ButtonNumber: number;
    /**
     * Button category.
     */
    Category: Category;
    /**
     * Is the button programmed.
     */
    IsProgrammed: boolean;
    /**
     * Button name.
     */
    Name: string;
    /**
     * Parent node address.
     */
    Parent: Address;
    /**
     * Button's programming model.
     */
    ProgrammingModel: Address;
};

/**
 * Defines a zone.
 * @private
 */
declare type ZoneAddress = Address & {
    /**
     * Zone name.
     */
    Name: string;
    /**
     * Zone control type.
     */
    ControlType: string;
    /**
     * (optional) Zone category if exists.
     */
    Category?: Category;
    /**
     * (optional) Associated device if exists.
     */
    Device?: Address;
    /**
     * (optional) Associated facade.
     */
    AssociatedFacade?: Address;
    /**
     * (optional) Associated area.
     */
    AssociatedArea?: Address;
    /**
     * (optional) Phase settings.
     */
    PhaseSettings?: PhaseSetting;
    /**
     * Sort order amongst others.
     */
    SortOrder?: number;
    /**
     * (optional) Associated trim tuning.
     */
    TuningSettings?: TuningSetting;
};

/**
 * Defines a zone status object.
 * @private
 */
declare type ZoneStatus = Address & {
    /**
     * Contact closure state.
     */
    CCOLevel: "Open" | "Closed";
    /**
     * Brightness level.
     */
    Level: number;
    /**
     * Binary switch state.
     */
    SwitchedLevel: "On" | "Off";
    /**
     * Fan speed state.
     */
    FanSpeed: FanSpeedType;
    /**
     * Associated zone address.
     */
    Zone: Address;
    /**
     * Accuracy status (always good)
     */
    StatusAccuracy: "Good";
    /**
     * Associated area address.
     */
    AssociatedArea: Address;
    /**
     * Zone avaibility status.
     */
    Availability: "Available" | "Unavailable" | "Mixed" | "Unknown";
    /**
     * Blind tilt state.
     */
    Tilt: number;
};

export { }
