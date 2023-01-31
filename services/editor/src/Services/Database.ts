import { IndexedDatabase } from "@valkyr/db";
import type { Edge } from "reactflow";

import type { EventBlock } from "../Modules/Editor/Library/Blocks/Event/Event.Collection";
import type { ReducerBlock } from "../Modules/Editor/Library/Blocks/Reducer/Reducer.Collection";
import type { StateBlock } from "../Modules/Editor/Library/Blocks/State/State.Collection";
import type { TypeBlock } from "../Modules/Editor/Library/Blocks/Type/Type.Collection";
import type { EditorNode } from "../Modules/Editor/Nodes/Node.Collection";

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
