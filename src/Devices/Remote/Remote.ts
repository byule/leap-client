import { Button, Remote as RemoteInterface } from "@mkellsy/hap-device";

/**
 * Defines a Pico remote device.
 * @public
 */
export interface Remote extends RemoteInterface {
    readonly buttons: Button[];

    /**
     * Waits for async initialization to complete (button loading).
     *
     * @returns A promise that resolves when the device is fully initialized.
     */
    initialize(): Promise<void>;
}
