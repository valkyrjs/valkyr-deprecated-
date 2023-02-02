import { db } from "~Services/Database";
import { format } from "~Services/Prettier";

import { ReducerBlock } from "../Block.Collection";

const defaultValue = format(`
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
  value = defaultValue,
  events = [],
  state
}: ReducerBlock): Promise<string> {
  const result = await db.collection<ReducerBlock>("blocks").insertOne({ type: "reducer", name, value, events, state });
  if (result.acknowledged === false) {
    throw new Error("Failed to create reducer block");
  }
  return result.insertedId;
}
