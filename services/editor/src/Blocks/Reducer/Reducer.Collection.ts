import { Document } from "@valkyr/db";

import { db } from "~Services/Database";
import { format } from "~Services/Prettier";

export type ReducerBlock = Document<{
  name: string;
  code: string;
  events: string[];
  state?: string;
}>;

const defaultCode = format(`
  async function reduce(state: State, event: EventRecord): Promise<State> {
    switch (event.type) {
      default: {
        return state;
      }
    }
  };
`);

/*
 |--------------------------------------------------------------------------------
 | Helpers
 |--------------------------------------------------------------------------------
 */

export async function createReducerBlock({
  name = "Reducer",
  code = defaultCode,
  events = [],
  state
}: ReducerBlock): Promise<string> {
  const result = await db.collection("reducers").insertOne({ name, code, events, state });
  if (result.acknowledged === false) {
    throw new Error("Failed to create reducer block");
  }
  return result.insertedId;
}
