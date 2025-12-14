import { EventEmitter } from "@mkellsy/event-emitter";
import { ProcessorAddress } from "../Response/ProcessorAddress";
/**
 * Creates and searches the network for devices.
 * @private
 */
export declare class Discovery extends EventEmitter<{
    Discovered: (processor: ProcessorAddress) => void;
    Failed: (error: Error) => void;
}> {
    private cache;
    private cached;
    private discovery?;
    /**
     * Creates a mDNS discovery object used to search the network for devices.
     *
     * ```js
     * const discovery = new Discovery();
     *
     * discovery.on("Discovered", (device: ProcessorAddress) => {  });
     * discovery.search()
     * ```
     */
    constructor();
    /**
     * Starts searching the network for devices.
     */
    search(): void;
    /**
     * Stops searching the network.
     */
    stop(): void;
    private onAvailable;
    private isProcessorCached;
    private isProcessorService;
    private cacheProcessor;
    private parseProcessorAddress;
}
//# sourceMappingURL=Discovery.d.ts.map