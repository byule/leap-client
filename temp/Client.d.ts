import { Action, Button, Device, DeviceState } from "@mkellsy/hap-device";
import { EventEmitter } from "@mkellsy/event-emitter";
import { Processor } from "./Devices/Processor/Processor";
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
     */
    constructor(refresh?: boolean);
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
//# sourceMappingURL=Client.d.ts.map