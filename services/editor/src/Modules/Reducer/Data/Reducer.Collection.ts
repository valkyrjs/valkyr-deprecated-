import { Document } from "@valkyr/db";

import { ModelManager } from "~Library/Monaco/ModelManager";
import { format } from "~Services/Prettier";

import { db } from "./Reducer.Database";

const defaultValue = format(`
  api.reducer("State", (state, event) => {
    switch (event.type) {
      default: {
        return state;
      }
    }
  });
`);

export type ReducerDocument = Document<{
  groupId: string;
  name: string;
  value: string;
  events: string[];
  state?: string;
}>;

/*
 |--------------------------------------------------------------------------------
 | Helpers
 |--------------------------------------------------------------------------------
 */

export async function createReducerBlock(groupId: string, name = crypto.randomUUID()): Promise<string> {
  const result = await db.collection("reducers").insertOne({ groupId, name, value: defaultValue, events: [] });
  if (result.acknowledged === false) {
    throw new Error("Failed to create reducer block");
  }
  return result.insertedId;
}

/*
 |--------------------------------------------------------------------------------
 | Monaco
 |--------------------------------------------------------------------------------
 */

const models = new ModelManager();

db.collection("reducers").subscribe({}, {}, (reducers) => {
  models.flush();
  for (const reducer of reducers) {
    registerReducerInterface(reducer);
  }
});

async function registerReducerInterface(_: ReducerDocument): Promise<void> {
  /*
  const state = await db.collection<StateBlock>("blocks").findOne({ id: reducer.state });
  if (state === undefined) {
    return;
  }
  const events = await db.collection<EventBlock>("blocks").find({ id: { $in: reducer.events } });
  const eventNames = events.map((event) => event.name);
  models.add(`
     interface Reducers {
       ${state.name}: {
         State: ${state.name};
         Event: ${eventNames.length === 0 ? "never" : getEventNamesRecord(eventNames)}
       }
     }
   `);
  */
}
