import { Document } from "@valkyr/db";

import { db } from "~Services/Database";
import { format } from "~Services/Prettier";

import { addEditorNode } from "../../../Nodes/Node.Collection";
import { ConnectionParams } from "../../../Nodes/Node.Types";

export type ReducerBlock = Document<{
  name: string;
  code: string;
  events: string[];
  state?: string;
}>;

const defaultCode = format(`
  async function reduce(state: State, event: EventRecord): Promise<State> {
    // write your reducer logic here ...
  };
`);

/*
 |--------------------------------------------------------------------------------
 | Helpers
 |--------------------------------------------------------------------------------
 */

export async function createReducerBlock(name = "Reducer", code = defaultCode) {
  const result = await db.collection("reducers").insertOne({ name, code, events: [] });
  if (result.acknowledged === false) {
    throw new Error("Failed to create reducer block");
  }
  await addEditorNode("reducer", result.insertedId);
}

export async function addReducerEdge(from: ConnectionParams, id: string): Promise<boolean> {
  switch (from.type) {
    case "event": {
      const result = await db.collection("reducers").updateOne(
        { id },
        {
          $push: {
            events: from.id
          }
        }
      );
      if (result.modified < 1) {
        return false;
      }
      return true;
    }
    case "state": {
      const result = await db.collection("reducers").updateOne(
        { id },
        {
          $set: {
            state: from.id
          }
        }
      );
      if (result.modified < 1) {
        return false;
      }
      return true;
    }
    default: {
      return false;
    }
  }
}
