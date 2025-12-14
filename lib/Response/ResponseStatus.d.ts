/**
 * Creates a response status object.
 * @private
 */
export declare class ResponseStatus {
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
//# sourceMappingURL=ResponseStatus.d.ts.map