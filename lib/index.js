"use strict";
/**
 * Publishes devices, states and actions to an event emitter using the Lutron
 * LEAP protocol.
 *
 * @remarks
 * This will autopmatically discover processors. You will need to press the
 * pairing button on your processor or bridge.
 *
 * @packageDocumentation
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = exports.pair = exports.connect = void 0;
const Association_1 = require("./Connection/Association");
const Context_1 = require("./Connection/Context");
const Discovery_1 = require("./Connection/Discovery");
const Client_1 = require("./Client");
Object.defineProperty(exports, "Client", { enumerable: true, get: function () { return Client_1.Client; } });
/**
 * Establishes a connection to all paired devices.
 *
 * @param refresh (optional) Setting this to true will not load devices from
 *                cache.
 *
 * @returns A reference to the location with all processors.
 * @public
 */
function connect(refresh) {
    return new Client_1.Client(refresh);
}
exports.connect = connect;
/**
 * Starts listening for pairing commands from processors.
 * @public
 */
function pair() {
    return new Promise((resolve, reject) => {
        const discovery = new Discovery_1.Discovery();
        const context = new Context_1.Context();
        discovery.on("Discovered", (processor) => {
            if (context.get(processor.id) == null) {
                const association = new Association_1.Association(processor);
                association
                    .authenticate()
                    .then((certificate) => {
                    context.set(processor, certificate);
                    resolve();
                })
                    .catch((error) => reject(error))
                    .finally(() => discovery.stop());
            }
        });
        discovery.search();
    });
}
exports.pair = pair;
