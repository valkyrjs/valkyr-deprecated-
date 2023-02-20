import { Document } from "@valkyr/db";

import { DataField, getFieldsType } from "~Library/DataField";
import { ModelManager } from "~Library/Monaco/ModelManager";

import { db } from "./Reducer.Database";

export type StateDocument = Document<{
  reducerId: string;
  name: string;
  data: DataField[];
}>;

/*
 |--------------------------------------------------------------------------------
 | Helpers
 |--------------------------------------------------------------------------------
 */

export async function createStateBlock(reducerId: string, name: string = crypto.randomUUID()): Promise<string> {
  const result = await db.collection("states").insertOne({ reducerId, name, data: [["name", "p:string"]] });
  if (result.acknowledged === false) {
    throw new Error("Failed to create state block");
  }
  return result.insertedId;
}

/*
 |--------------------------------------------------------------------------------
 | Monaco
 |--------------------------------------------------------------------------------
 */

const models = new ModelManager();

db.collection("states").subscribe({}, {}, (states) => {
  models.flush();
  for (const state of states) {
    models.add(getFieldsType(state.name, state.data));
  }
});
