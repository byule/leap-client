import { Certificate } from "../Response/Certificate";
import { ProcessorAddress } from "../Response/ProcessorAddress";
/**
 * Defines an authentication context and state for a processor.
 * @private
 */
export declare class Context {
    private context;
    /**
     * Create an authentication context, and load any cached certificates. This
     * ensures that processors can be paired with device, and authentication
     * only happens once.
     */
    constructor();
    /**
     * A list of processor ids currently paired.
     *
     * @returns A string array of processor ids.
     */
    get processors(): string[];
    /**
     * Check to see if the context has a processor paired.
     *
     * @param id The processor id to check.
     *
     * @returns True if paired, false if not.
     */
    has(id: string): boolean;
    /**
     * Fetches the authentication certificate for a processor.
     *
     * @param id The processor id to fetch.
     *
     * @returns An authentication certificate or undefined if it doesn't exist.
     */
    get(id: string): Certificate | undefined;
    /**
     * Adds a processor authentication certificate to the context.
     *
     * @param processor The processor address object to add.
     * @param context The authentication certificate to associate.
     */
    set(processor: ProcessorAddress, context: Certificate): void;
    private decrypt;
    private encrypt;
    private open;
    private save;
}
//# sourceMappingURL=Context.d.ts.map