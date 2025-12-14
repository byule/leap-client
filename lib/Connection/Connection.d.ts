import { Parser } from "../Response/Parser";
import { Certificate } from "../Response/Certificate";
import { CertificateRequest } from "../Response/CertificateRequest";
import { Response } from "../Response/Response";
/**
 * Connects to a device with the provided secure host.
 * @private
 */
export declare class Connection extends Parser<{
    Connect: (protocol: string) => void;
    Disconnect: () => void;
    Response: (response: Response) => void;
    Message: (response: Response) => void;
    Error: (error: Error) => void;
}> {
    private socket?;
    private secure;
    private teardown;
    private host;
    private certificate;
    private requests;
    private subscriptions;
    /**
     * Creates a new connection to a device.
     *
     * ```js
     * const connection = new Connection("192.168.1.1", { ca, key, cert });
     * ```
     *
     * @param host The ip address of the device.
     * @param certificate Authentication certificate.
     */
    constructor(host: string, certificate?: Certificate);
    /**
     * Detects if a host is reachable.
     *
     * @param host Address of the device.
     *
     * @returns True if the device is rechable, false if not.
     */
    static reachable(host: string): Promise<boolean>;
    /**
     * Asyncronously connects to a device.
     *
     * ```js
     * await connection.connect();
     * ```
     */
    connect(): Promise<void>;
    /**
     * Disconnects from a device.
     *
     * ```js
     * connection.disconnect();
     * ```
     */
    disconnect(): void;
    /**
     * Fetches a record from the device. Not this only works for a secure
     * connections.
     *
     * ```js
     * const record = await connection.read<Zone>("/zone/123456");
     * ```
     *
     * @param url The url of the record, this is typically a device address.
     *
     * @returns A payload or rejects. The payload is typed per call.
     */
    read<T>(url: string): Promise<T>;
    /**
     * This sends an authentication request. This only works for non-secure
     * connections.
     *
     * ```js
     * const certificate = await connection.authenticate(csr);
     * ```
     *
     * @param csr Sends a certificate request, typically created with open ssl.
     *
     * @returns An authentication certificate or rejects if failed.
     */
    authenticate(csr: CertificateRequest): Promise<Certificate>;
    /**
     * Sends a commend to update a device. This only works for secure
     * connections.
     *
     * ```js
     * await connection.update("/zone/123456", state);
     * ```
     *
     * @param url A command url typically the href of a device.
     * @param body An object of values to update.
     *
     * @returns Returns a status paylod. The type is set per call.
     */
    update<T>(url: string, body: Record<string, unknown>): Promise<T>;
    /**
     * Sends a known command to the device. This only works for secure
     * connections.
     *
     * ```js
     * await connection.command("/zone/123456", command);
     * ```
     *
     * @param url A command url typically the href of a device.
     * @param command A known command object.
     */
    command(url: string, command: Record<string, unknown>): Promise<void>;
    /**
     * Subscribes to a record on the device. This will bind a listener to that
     * record that will get called every time the record changes. This is
     * helpful for keeping track of the status of an area, zone, or device.
     * This only works for secure connections.
     *
     * ```js
     * connection.subscribe("/zone/123456/status", (response) => { });
     * ```
     *
     * @param url Url to subscribe to.
     * @param listener Callback to run when the record updates.
     */
    subscribe<T>(url: string, listener: (response: T) => void): Promise<void>;
    private drainRequests;
    private sendRequest;
    private onResponse;
    private onSocketData;
    private onSocketDisconnect;
    private onSocketError;
    private authorityCertificate;
    private physicalAccess;
}
//# sourceMappingURL=Connection.d.ts.map