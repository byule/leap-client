import * as Body from "./BodyType";
import { RequestType } from "./RequestType";
import { ResponseHeader } from "./ResponseHeader";
/**
 * Defines a processor response.
 * @private
 */
export declare class Response {
    CommuniqueType?: RequestType;
    Body?: Body.BodyType;
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
    static parse(value: string): Response;
}
//# sourceMappingURL=Response.d.ts.map