import * as monaco from "monaco-editor";

import { getFieldsType } from "~Blocks/BlockFields";
import { db } from "~Services/Database";

import { StateBlock } from "../Block.Collection";

/*
 |--------------------------------------------------------------------------------
 | Helpers
 |--------------------------------------------------------------------------------
 */

export async function createStateBlock({ name = "", data = [["name", "p:string"]] }: StateBlock): Promise<string> {
  const result = await db.collection<StateBlock>("blocks").insertOne({ type: "state", name, data });
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

const models: monaco.editor.ITextModel[] = [];

db.collection<StateBlock>("blocks").subscribe({ type: "state" }, {}, (states) => {
  flushStateModels();
  for (const state of states) {
    models.push(monaco.editor.createModel(getFieldsType(state.name, state.data), "typescript"));
  }
});

function flushStateModels() {
  if (models.length > 0) {
    const model = models.pop();
    if (model !== undefined) {
      model.dispose();
    }
  }
}
