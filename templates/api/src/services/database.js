"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const mongodb_1 = require("mongodb");
const config_1 = require("../config");
exports.db = {
    connect,
    collection
};
const client = new mongodb_1.MongoClient(config_1.config.mongo.uri);
/**
 * Establishes a connection to the mongodb server and keeps it alive.
 */
async function connect() {
    await client.connect();
    client.on("close", connect);
}
/**
 * Get a mongodb collection to perform query operations on.
 *
 * @param name - Name of the collection.
 */
function collection(name) {
    return client.db(config_1.config.mongo.name).collection(name);
}
