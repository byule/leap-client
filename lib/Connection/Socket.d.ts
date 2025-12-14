/// <reference types="node" />
import { EventEmitter } from "@mkellsy/event-emitter";
import { Certificate } from "../Response/Certificate";
import { Message } from "../Response/Message";
/**
 * Creates a connections underlying socket.
 * @private
 */
export declare class Socket extends EventEmitter<{
    Error: (error: Error) => void;
    Data: (data: Buffer) => void;
    Disconnect: () => void;
}> {
    private connection?;
    private readonly host;
    private readonly port;
    private readonly certificate;
    /**
     * Creates a socket.
     *
     * @param host The IP address of the device.
     * @param port The port the device listenes on.
     * @param certificate An authentication certificate.
     */
    constructor(host: string, port: number, certificate: Certificate);
    /**
     * Establishes a connection to the device.
     *
     * @returns A connection protocol.
     */
    connect(): Promise<string>;
    /**
     * Disconnects from a device.
     */
    disconnect(): void;
    /**
     * Writes a message to the connection.
     *
     * @param message A message to write.
     */
    write(message: Message): Promise<void>;
    private onSocketData;
    private onSocketTimeout;
    private onSocketClose;
    private onSocketError;
}
//# sourceMappingURL=Socket.d.ts.map