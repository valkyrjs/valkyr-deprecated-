import { IndexedDatabase } from "@valkyr/db";
import type { Edge } from "reactflow";

import type { EventBlock } from "../modules/editor/library/blocks/event/event.collection";
import type { ReducerBlock } from "../modules/editor/library/blocks/reducer/reducer.collection";
import type { StateBlock } from "../modules/editor/library/blocks/state/state.collection";
import type { TypeBlock } from "../modules/editor/library/blocks/type/type.collection";
import type { EditorNode } from "../modules/editor/nodes/node.collection";

export type Collections = {
  events: EventBlock;
  reducers: ReducerBlock;
  states: StateBlock;
  types: TypeBlock;
  nodes: EditorNode;
  edges: Edge;
};

export const db = new IndexedDatabase<Collections>({
  name: "valkyr:editor",
  version: 1,
  registrars: [
    {
      name: "events"
    },
    {
      name: "reducers"
    },
    {
      name: "states"
    },
    {
      name: "types"
    },
    {
      name: "nodes"
    },
    {
      name: "edges"
    }
  ],
  log: console.log
});

/*
 |--------------------------------------------------------------------------------
 | Console Tools
 |--------------------------------------------------------------------------------
 */

declare global {
  interface Window {
    db: typeof db;
  }
}

window.db = db;
