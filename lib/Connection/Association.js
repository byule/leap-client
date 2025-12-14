"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Association = void 0;
const node_forge_1 = require("node-forge");
const hap_device_1 = require("@mkellsy/hap-device");
const Connection_1 = require("./Connection");
/**
 * Defines the logic for pairing a processor to this device.
 * @private
 */
class Association {
    /**
     * Creates an association to a processor (pairing).
     *
     * @param processor The processor to pair.
     */
    constructor(processor) {
        const ip = processor.addresses.find((address) => {
            return address.family === hap_device_1.HostAddressFamily.IPv4;
        }) || processor.addresses[0];
        this.connection = new Connection_1.Connection(ip.address);
    }
    /**
     * Authenticate with the processor. This listens for when the pairing
     * button is pressed on the physical processor.
     *
     * @returns An authentication certificate.
     */
    authenticate() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => {
                this.connection
                    .connect()
                    .then(() => {
                    this.createCertificateRequest("mkellsy-mqtt-lutron")
                        .then((request) => {
                        this.connection
                            .authenticate(request)
                            .then((certificate) => resolve(certificate))
                            .catch((error) => reject(error));
                    })
                        .catch((error) => reject(error));
                })
                    .catch((error) => reject(error));
            });
        });
    }
    /*
     * Creates a certificate reqquest.
     */
    createCertificateRequest(name) {
        return new Promise((resolve, reject) => {
            node_forge_1.pki.rsa.generateKeyPair({ bits: 2048 }, (error, keys) => {
                if (error == null) {
                    const request = node_forge_1.pki.createCertificationRequest();
                    request.publicKey = keys.publicKey;
                    request.setSubject([{ name: "commonName", value: name }]);
                    request.sign(keys.privateKey);
                    return resolve({
                        key: keys.privateKey,
                        cert: node_forge_1.pki.certificationRequestToPem(request),
                    });
                }
                return reject(new Error("Error generating RSA keys"));
            });
        });
    }
}
exports.Association = Association;
