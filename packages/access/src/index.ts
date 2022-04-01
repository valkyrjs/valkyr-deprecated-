import type { Db } from "mongodb";

import { container } from "./Container";

export * from "./Attributes";
export * from "./Permission";
export * from "./Role";

/*
 |--------------------------------------------------------------------------------
 | Setup
 |--------------------------------------------------------------------------------
 */

async function setup(database: Db) {
  container.set("Database", database);
}

/*
 |--------------------------------------------------------------------------------
 | Access
 |--------------------------------------------------------------------------------
 */

export const access = {
  setup
};
