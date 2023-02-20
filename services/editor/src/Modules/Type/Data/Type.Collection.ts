import { Document } from "@valkyr/db";

import { ModelManager } from "~Library/Monaco/ModelManager";

import { db } from "./Type.Database";

export type TypeDocument = Document<{
  groupId?: string;
  name: string;
  value: string;
}>;

/*
 |--------------------------------------------------------------------------------
 | Helpers
 |--------------------------------------------------------------------------------
 */

export async function createTypeBlock(groupId: string, name = crypto.randomUUID()): Promise<string> {
  const result = await db.collection("types").insertOne({ groupId, name, value: "" });
  if (result.acknowledged === false) {
    throw new Error("Failed to create type block");
  }
  return result.insertedId;
}

/*
 |--------------------------------------------------------------------------------
 | Monaco
 |--------------------------------------------------------------------------------
 */

const models = new ModelManager();

db.collection("types").subscribe({}, {}, (types) => {
  models.flush();
  for (const type of types) {
    models.add(type.value);
  }
});
