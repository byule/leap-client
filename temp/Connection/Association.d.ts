import { Certificate } from "../Response/Certificate";
import { ProcessorAddress } from "../Response/ProcessorAddress";
/**
 * Defines the logic for pairing a processor to this device.
 * @private
 */
export declare class Association {
    private connection;
    /**
     * Creates an association to a processor (pairing).
     *
     * @param processor The processor to pair.
     */
    constructor(processor: ProcessorAddress);
    /**
     * Authenticate with the processor. This listens for when the pairing
     * button is pressed on the physical processor.
     *
     * @returns An authentication certificate.
     */
    authenticate(): Promise<Certificate>;
    private createCertificateRequest;
}
//# sourceMappingURL=Association.d.ts.map