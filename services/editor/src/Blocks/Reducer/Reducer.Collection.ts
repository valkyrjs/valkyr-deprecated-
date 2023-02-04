import * as monaco from "monaco-editor";

import { getEventNamesRecord } from "~Blocks/Event/Event.Collection";
import { db } from "~Services/Database";
import { format } from "~Services/Prettier";

import { EventBlock, ReducerBlock, StateBlock } from "../Block.Collection";

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

export async function createReducerBlock({ value = defaultValue, events = [], state }: ReducerBlock): Promise<string> {
  const result = await db
    .collection<ReducerBlock>("blocks")
    .insertOne({ type: "reducer", name: crypto.randomUUID(), value, events, state });
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

const models: monaco.editor.ITextModel[] = [];

db.collection<ReducerBlock>("blocks").subscribe({ type: "reducer" }, {}, (reducers) => {
  flushReducerModels();
  for (const reducer of reducers) {
    registerReducerInterface(reducer);
  }
});

async function registerReducerInterface(reducer: ReducerBlock): Promise<void> {
  const state = await db.collection<StateBlock>("blocks").findOne({ id: reducer.state });
  if (state === undefined) {
    return;
  }
  const events = await db.collection<EventBlock>("blocks").find({ id: { $in: reducer.events } });
  const eventNames = events.map((event) => event.name);
  models.push(
    monaco.editor.createModel(
      format(`
        interface Reducers {
          ${state.name}: {
            State: ${state.name};
            Event: ${eventNames.length === 0 ? "never" : getEventNamesRecord(eventNames)}
          }
        }
      `),
      "typescript"
    )
  );
}

function flushReducerModels() {
  if (models.length > 0) {
    const model = models.pop();
    if (model !== undefined) {
      model.dispose();
      flushReducerModels();
    }
  }
}
