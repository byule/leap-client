"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Connection = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const net_1 = __importDefault(require("net"));
const bson_1 = require("bson");
const node_forge_1 = require("node-forge");
const uuid_1 = require("uuid");
const Parser_1 = require("../Response/Parser");
const ExceptionDetail_1 = require("../Response/ExceptionDetail");
const Response_1 = require("../Response/Response");
const Socket_1 = require("./Socket");
const SOCKET_PORT = 8083;
const SECURE_SOCKET_PORT = 8081;
const REACHABLE_TIMEOUT = 1000;
/**
 * Connects to a device with the provided secure host.
 * @private
 */
class Connection extends Parser_1.Parser {
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
    constructor(host, certificate) {
        super();
        this.secure = false;
        this.teardown = false;
        this.requests = new Map();
        this.subscriptions = new Map();
        /*
         * Listener for taged responses from the device.
         */
        this.onResponse = (response) => {
            const tag = response.Header.ClientTag;
            if (tag == null) {
                this.emit("Message", response);
                return;
            }
            const request = this.requests.get(tag);
            if (request != null) {
                clearTimeout(request.timeout);
                this.requests.delete(tag);
                request.resolve(response);
            }
            const subscription = this.subscriptions.get(tag);
            if (subscription == null)
                return;
            subscription.callback(response);
        };
        /*
         * Handles all data recieved from a device.
         */
        this.onSocketData = (data) => {
            if (this.secure) {
                this.parse(data, this.onResponse);
            }
            else {
                this.emit("Message", JSON.parse(data.toString()));
            }
        };
        /*
         * Listener for any socket disconnects. This will teardown the failed
         * connection and will attempt to reconnect, unless a discrete disconnect
         * is invoked.
         */
        this.onSocketDisconnect = () => {
            if (!this.teardown)
                this.emit("Disconnect");
        };
        /*
         * Listener for any error from the socket.
         */
        this.onSocketError = (error) => {
            this.emit("Error", error);
        };
        this.host = host;
        this.secure = certificate != null;
        this.certificate = Object.assign({ ca: "", cert: "", key: "" }, (certificate != null ? certificate : this.authorityCertificate()));
    }
    /**
     * Detects if a host is reachable.
     *
     * @param host Address of the device.
     *
     * @returns True if the device is rechable, false if not.
     */
    static reachable(host) {
        return new Promise((resolve) => {
            const socket = new net_1.default.Socket();
            const response = (success) => {
                socket.destroy();
                resolve(success);
            };
            socket.setTimeout(REACHABLE_TIMEOUT);
            socket.once("error", () => response(false));
            socket.once("timeout", () => response(false));
            socket.connect(SOCKET_PORT, host, () => response(true));
        });
    }
    /**
     * Asyncronously connects to a device.
     *
     * ```js
     * await connection.connect();
     * ```
     */
    connect() {
        return new Promise((resolve, reject) => {
            this.teardown = false;
            this.socket = undefined;
            const subscriptions = [...this.subscriptions.values()];
            const socket = new Socket_1.Socket(this.host, this.secure ? SECURE_SOCKET_PORT : SOCKET_PORT, this.certificate);
            socket.on("Data", this.onSocketData);
            socket.on("Error", this.onSocketError);
            socket.on("Disconnect", this.onSocketDisconnect);
            socket
                .connect()
                .then((protocol) => {
                this.physicalAccess(this.secure).then(() => {
                    const waits = [];
                    this.subscriptions.clear();
                    this.socket = socket;
                    if (this.secure) {
                        for (const subscription of subscriptions) {
                            /* istanbul ignore next */
                            waits.push(this.subscribe(subscription.url, subscription.listener));
                        }
                    }
                    Promise.all(waits).then(() => {
                        this.emit("Connect", protocol);
                        resolve();
                    });
                });
            })
                .catch((error) => reject(error));
        });
    }
    /**
     * Disconnects from a device.
     *
     * ```js
     * connection.disconnect();
     * ```
     */
    disconnect() {
        var _a;
        this.teardown = true;
        if (this.secure)
            this.drainRequests();
        this.subscriptions.clear();
        (_a = this.socket) === null || _a === void 0 ? void 0 : _a.disconnect();
    }
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
    read(url) {
        return new Promise((resolve, reject) => {
            const tag = (0, uuid_1.v4)();
            if (!this.secure)
                return reject(new Error("Only available for secure connections"));
            this.sendRequest(tag, "ReadRequest", url)
                .then((response) => {
                const body = response.Body;
                if (body == null)
                    return reject(new Error(`${url} no body`));
                if (response.Body instanceof ExceptionDetail_1.ExceptionDetail)
                    return reject(new Error(response.Body.Message));
                return resolve(response.Body);
            })
                .catch((error) => reject(error));
        });
    }
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
    authenticate(csr) {
        return new Promise((resolve, reject) => {
            var _a;
            if (this.secure)
                return reject(new Error("Only available for physical connections"));
            const message = {
                Header: {
                    RequestType: "Execute",
                    Url: "/pair",
                    ClientTag: "get-cert",
                },
                Body: {
                    CommandType: "CSR",
                    Parameters: {
                        CSR: csr.cert,
                        DisplayName: "get_lutron_cert.py",
                        DeviceUID: "000000000000",
                        Role: "Admin",
                    },
                },
            };
            /*
             * Real clocks are required for proper socket testing, this
             * requires a fake clock or unit test timeout extention. Excluding
             * this to speedup build times.
             */
            /* istanbul ignore next */
            const timeout = setTimeout(() => reject(new Error("Authentication timeout exceeded")), 5000);
            this.once("Message", (response) => {
                clearTimeout(timeout);
                resolve({
                    ca: response.Body.SigningResult.RootCertificate,
                    cert: response.Body.SigningResult.Certificate,
                    key: node_forge_1.pki.privateKeyToPem(csr.key),
                });
            });
            /* istanbul ignore next */
            (_a = this.socket) === null || _a === void 0 ? void 0 : _a.write(message);
        });
    }
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
    update(url, body) {
        return new Promise((resolve, reject) => {
            const tag = (0, uuid_1.v4)();
            if (!this.secure)
                return reject(new Error("Only available for secure connections"));
            this.sendRequest(tag, "UpdateRequest", url, body)
                .then((response) => {
                if (response.Body instanceof ExceptionDetail_1.ExceptionDetail) {
                    return reject(new Error(response.Body.Message));
                }
                return resolve(response.Body);
            })
                .catch((error) => reject(error));
        });
    }
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
    command(url, command) {
        return new Promise((resolve, reject) => {
            const tag = (0, uuid_1.v4)();
            if (!this.secure)
                return reject(new Error("Only available for secure connections"));
            this.sendRequest(tag, "CreateRequest", url, command)
                .then(() => resolve())
                .catch((error) => reject(error));
        });
    }
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
    subscribe(url, listener) {
        return new Promise((resolve, reject) => {
            if (!this.secure)
                return reject(new Error("Only available for secure connections"));
            const tag = (0, uuid_1.v4)();
            this.sendRequest(tag, "SubscribeRequest", url)
                .then((response) => {
                if (response.Header.StatusCode != null && response.Header.StatusCode.isSuccessful()) {
                    this.subscriptions.set(tag, {
                        url,
                        listener,
                        callback: (response) => listener(response.Body),
                    });
                }
                resolve();
            })
                .catch((error) => reject(error));
        });
    }
    /*
     * Clears any ongoing commands. This will cancel all incomplete and failed
     * connections.
     */
    drainRequests() {
        /*
         * Draining requests is incredibly difficult to test. This requires
         * very randon chunks that depend on network conditions. Testing this
         * functionallity is best suited for the buffered responce object.
         */
        /* istanbul ignore next */
        for (const tag of this.requests.keys()) {
            const request = this.requests.get(tag);
            clearTimeout(request.timeout);
        }
        this.requests.clear();
    }
    /*
     * Internally sends read, update, and command requests.
     */
    sendRequest(tag, requestType, url, body) {
        return new Promise((resolve, reject) => {
            /*
             * Testing tag reuse is difficult when mocking payloads. Tagged
             * payloads are transparent past this stage, and unit tests are
             * unable to pause the fulfillment.
             */
            /* istanbul ignore next */
            if (this.requests.has(tag)) {
                const request = this.requests.get(tag);
                request.reject(new Error(`tag "${tag}" reused`));
                clearTimeout(request.timeout);
                this.requests.delete(tag);
            }
            const message = {
                CommuniqueType: requestType,
                Header: {
                    ClientTag: tag,
                    Url: url,
                },
                Body: body,
            };
            /* istanbul ignore next */
            if (this.socket == null)
                return reject(new Error("Connection not established"));
            this.socket
                .write(message)
                .then(() => {
                this.requests.set(tag, {
                    message,
                    resolve,
                    reject,
                    timeout: setTimeout(
                    /* istanbul ignore next */
                    () => resolve(Response_1.Response.parse(JSON.stringify({
                        Header: { MessageBodyType: "ExceptionDetail" },
                        Body: { Message: "Request timeout" },
                    }))), 5000),
                });
            })
                .catch((error) => reject(error));
        });
    }
    /*
     * Loads a saved device certificate. Certificates are created when a
     * processor is paired with this device.
     */
    authorityCertificate() {
        const filename = path_1.default.resolve(__dirname, "../authority");
        if (fs_1.default.existsSync(filename)) {
            const bytes = fs_1.default.readFileSync(filename);
            if (bytes == null)
                return null;
            const certificate = bson_1.BSON.deserialize(bytes);
            certificate.ca = Buffer.from(certificate.ca, "base64").toString("utf8");
            certificate.key = Buffer.from(certificate.key, "base64").toString("utf8");
            certificate.cert = Buffer.from(certificate.cert, "base64").toString("utf8");
            return certificate;
        }
        return null;
    }
    /*
     * For non-secure connections, this will wait for a processor to enter
     * pairing mode. This requires a button press on the physical processor.
     */
    physicalAccess(secure) {
        return new Promise((resolve, reject) => {
            if (secure)
                return resolve();
            /*
             * Testing processor errors and physical button press timeout is
             * not feasible for unit tests. This functionallity is best tested
             * manually with access to the processor.
             */
            /* istanbul ignore next */
            const timeout = setTimeout(() => reject(new Error("Physical timeout exceeded")), 60000);
            this.once("Message", (response) => {
                /* istanbul ignore else */
                if (response.Body.Status.Permissions.includes("PhysicalAccess")) {
                    clearTimeout(timeout);
                    return resolve();
                }
                /* istanbul ignore next */
                return reject(new Error("Unknown pairing error"));
            });
        });
    }
}
exports.Connection = Connection;
