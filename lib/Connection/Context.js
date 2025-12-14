"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Context = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const os_1 = __importDefault(require("os"));
const bson_1 = require("bson");
/**
 * Defines an authentication context and state for a processor.
 * @private
 */
class Context {
    /**
     * Create an authentication context, and load any cached certificates. This
     * ensures that processors can be paired with device, and authentication
     * only happens once.
     */
    constructor() {
        this.context = {};
        const context = this.open("pairing") || {};
        const keys = Object.keys(context);
        for (let i = 0; i < keys.length; i++) {
            context[keys[i]] = this.decrypt(context[keys[i]]);
        }
        this.context = context;
    }
    /**
     * A list of processor ids currently paired.
     *
     * @returns A string array of processor ids.
     */
    get processors() {
        return Object.keys(this.context).filter((key) => key !== "authority");
    }
    /**
     * Check to see if the context has a processor paired.
     *
     * @param id The processor id to check.
     *
     * @returns True if paired, false if not.
     */
    has(id) {
        return this.context[id] != null;
    }
    /**
     * Fetches the authentication certificate for a processor.
     *
     * @param id The processor id to fetch.
     *
     * @returns An authentication certificate or undefined if it doesn't exist.
     */
    get(id) {
        return this.context[id];
    }
    /**
     * Adds a processor authentication certificate to the context.
     *
     * @param processor The processor address object to add.
     * @param context The authentication certificate to associate.
     */
    set(processor, context) {
        this.context[processor.id] = Object.assign({}, context);
        this.save("pairing", this.context);
    }
    /*
     * Decrypts an authentication certificate.
     */
    decrypt(context) {
        if (context == null)
            return null;
        context.ca = Buffer.from(context.ca, "base64").toString("utf8");
        context.key = Buffer.from(context.key, "base64").toString("utf8");
        context.cert = Buffer.from(context.cert, "base64").toString("utf8");
        return context;
    }
    /*
     * Encrypts a certificate for storage. This ensures security at rest.
     */
    encrypt(context) {
        if (context == null)
            return null;
        context.ca = Buffer.from(context.ca).toString("base64");
        context.key = Buffer.from(context.key).toString("base64");
        context.cert = Buffer.from(context.cert).toString("base64");
        return context;
    }
    /*
     * Opens the context storage and loads paired processors.
     */
    open(filename) {
        const directory = path_1.default.join(os_1.default.homedir(), ".leap");
        if (!fs_1.default.existsSync(directory))
            fs_1.default.mkdirSync(directory);
        if (fs_1.default.existsSync(path_1.default.join(directory, filename))) {
            const bytes = fs_1.default.readFileSync(path_1.default.join(directory, filename));
            return bson_1.BSON.deserialize(bytes);
        }
        return null;
    }
    /*
     * Saves the context to storage.
     */
    save(filename, context) {
        const directory = path_1.default.join(os_1.default.homedir(), ".leap");
        if (!fs_1.default.existsSync(directory))
            fs_1.default.mkdirSync(directory);
        const clear = Object.assign({}, context);
        const keys = Object.keys(clear);
        for (let i = 0; i < keys.length; i++) {
            clear[keys[i]] = this.encrypt(clear[keys[i]]);
        }
        fs_1.default.writeFileSync(path_1.default.join(directory, filename), bson_1.BSON.serialize(clear));
    }
}
exports.Context = Context;
