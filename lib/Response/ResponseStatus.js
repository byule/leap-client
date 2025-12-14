"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResponseStatus = void 0;
/**
 * Creates a response status object.
 * @private
 */
class ResponseStatus {
    /**
     * Creates a response status object.
     *
     * @param message Complete response.
     * @param code Response code from the message.
     */
    constructor(message, code) {
        this.message = message;
        this.code = code;
    }
    /**
     * Creates a response status object from a string.
     *
     * @param value Status string.
     *
     * @returns A response status object.
     */
    static fromString(value) {
        const parts = value === null || value === void 0 ? void 0 : value.split(" ", 2);
        if (parts == null || parts.length === 1) {
            return new ResponseStatus(value);
        }
        const code = parseInt(parts[0], 10);
        if (Number.isNaN(code)) {
            return new ResponseStatus(value);
        }
        return new ResponseStatus(parts[1], code);
    }
    /**
     * Is the status successful.
     *
     * @returns True if successful, false if not.
     */
    isSuccessful() {
        return this.code !== undefined && this.code >= 200 && this.code < 300;
    }
}
exports.ResponseStatus = ResponseStatus;
