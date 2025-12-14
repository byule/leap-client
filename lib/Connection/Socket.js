"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Socket = void 0;
const event_emitter_1 = require("@mkellsy/event-emitter");
const tls_1 = require("tls");
const KEEPALIVE_INITIAL_DELAY = 10000;
const INACTIVITY_TIMEOUT = 30000;
/**
 * Creates a connections underlying socket.
 * @private
 */
class Socket extends event_emitter_1.EventEmitter {
    /**
     * Creates a socket.
     *
     * @param host The IP address of the device.
     * @param port The port the device listenes on.
     * @param certificate An authentication certificate.
     */
    constructor(host, port, certificate) {
        super();
        /*
         * Listens for data from the socket.
         */
        this.onSocketData = (data) => {
            this.emit("Data", data);
        };
        /*
         * Listens for socket timeouts.
         */
        this.onSocketTimeout = () => {
            this.emit("Error", new Error("connect ETIMEDOUT"));
        };
        /*
         * Listenes for discrete disconects from the socket.
         */
        this.onSocketClose = () => {
            this.emit("Disconnect");
        };
        /*
         * Listenes for any errors from the socket. This will filter out any socket
         */
        this.onSocketError = (error) => {
            this.emit("Error", error);
        };
        this.host = host;
        this.port = port;
        this.certificate = certificate;
    }
    /**
     * Establishes a connection to the device.
     *
     * @returns A connection protocol.
     */
    connect() {
        return new Promise((resolve, reject) => {
            const connection = (0, tls_1.connect)(this.port, this.host, {
                secureContext: (0, tls_1.createSecureContext)(this.certificate),
                secureProtocol: "TLS_method",
                rejectUnauthorized: false,
            });
            connection.once("secureConnect", () => {
                this.connection = connection;
                this.connection.off("error", reject);
                this.connection.on("timeout", this.onSocketTimeout);
                this.connection.on("error", this.onSocketError);
                this.connection.on("close", this.onSocketClose);
                this.connection.on("data", this.onSocketData);
                this.connection.setKeepAlive(true, KEEPALIVE_INITIAL_DELAY);
                this.connection.setTimeout(INACTIVITY_TIMEOUT);
                resolve(this.connection.getProtocol() || "Unknown");
            });
            connection.once("error", reject);
        });
    }
    /**
     * Disconnects from a device.
     */
    disconnect() {
        var _a, _b;
        (_a = this.connection) === null || _a === void 0 ? void 0 : _a.end();
        (_b = this.connection) === null || _b === void 0 ? void 0 : _b.destroy();
    }
    /**
     * Writes a message to the connection.
     *
     * @param message A message to write.
     */
    write(message) {
        return new Promise((resolve, reject) => {
            if (this.connection == null)
                return reject(new Error("connection not established"));
            this.connection.write(`${JSON.stringify(message)}\n`, (error) => {
                if (error != null)
                    return reject(error);
                return resolve();
            });
        });
    }
}
exports.Socket = Socket;
