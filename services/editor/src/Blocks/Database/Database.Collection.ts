import { db } from "~Services/Database";

import { DatabaseBlock, DatabaseConfig } from "../Block.Collection";

const defaultConfig: DatabaseConfig = {
  provider: "mongo",
  database: "valkyr",
  endpoint: "mongodb://localhost:27017"
};

/*
 |--------------------------------------------------------------------------------
 | Helpers
 |--------------------------------------------------------------------------------
 */

export async function createDatabaseBlock({
  name = "Database",
  config = defaultConfig
}: Partial<DatabaseBlock> = {}): Promise<string> {
  const result = await db.collection<DatabaseBlock>("blocks").insertOne({ type: "database", name, config });
  if (result.acknowledged === false) {
    throw new Error("Failed to create database block");
  }
  return result.insertedId;
}
