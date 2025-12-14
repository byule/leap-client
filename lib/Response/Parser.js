"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Parser = void 0;
const event_emitter_1 = require("@mkellsy/event-emitter");
const Response_1 = require("./Response");
/**
 * Enables response buffering.
 * @private
 */
class Parser extends event_emitter_1.EventEmitter {
    constructor() {
        super(...arguments);
        this.buffer = "";
    }
    /**
     * Parses a raw response, and returns via a callback.
     *
     * @param data Raw socket buffer.
     * @param callback Listener for complete response.
     */
    parse(data, callback) {
        const response = this.buffer + data.toString();
        const lines = response.split(/\r?\n/);
        if (lines.length - 1 === 0) {
            this.buffer = response;
            return;
        }
        this.buffer = lines[lines.length - 1] || "";
        for (const line of lines.slice(0, lines.length - 1)) {
            callback(Response_1.Response.parse(line));
        }
    }
}
exports.Parser = Parser;
