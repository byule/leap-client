/// <reference types="node" />
import { EventEmitter } from "@mkellsy/event-emitter";
import { Response } from "./Response";
/**
 * Enables response buffering.
 * @private
 */
export declare class Parser<MAP extends {
    [key: string]: (...args: any[]) => void;
}> extends EventEmitter<MAP> {
    private buffer;
    /**
     * Parses a raw response, and returns via a callback.
     *
     * @param data Raw socket buffer.
     * @param callback Listener for complete response.
     */
    parse(data: Buffer, callback: (response: Response) => void): void;
}
//# sourceMappingURL=Parser.d.ts.map