import { Document, MongoClient } from "mongodb";

import { config } from "../config";

export const db = {
  connect,
  collection
};

const client = new MongoClient(config.mongo.uri);

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
function collection<T extends Document>(name: string) {
  return client.db(config.mongo.name).collection<T>(name);
}
