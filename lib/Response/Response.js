"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Response = void 0;
const ResponseHeader_1 = require("./ResponseHeader");
const ResponseStatus_1 = require("./ResponseStatus");
/**
 * Defines a processor response.
 * @private
 */
class Response {
    /**
     * Creates a new response object.
     */
    constructor() {
        this.Header = new ResponseHeader_1.ResponseHeader();
    }
    /**
     * Parses complete responses to a response object.
     *
     * @param value The assembled response.
     *
     * @returns Returns a response object.
     */
    static parse(value) {
        const payload = JSON.parse(value);
        const status = payload.Header.StatusCode == null ? undefined : ResponseStatus_1.ResponseStatus.fromString(payload.Header.StatusCode);
        const header = Object.assign({}, payload.Header, {
            StatusCode: status,
            MessageBodyType: payload.Header.MessageBodyType,
        });
        if (header.MessageBodyType == null) {
            return Object.assign(new Response(), { Header: header });
        }
        const key = Object.keys(payload.Body || {})[0];
        const body = key != null ? payload.Body[key] || undefined : undefined;
        return Object.assign(new Response(), payload, { Header: header, Body: body });
    }
}
exports.Response = Response;
