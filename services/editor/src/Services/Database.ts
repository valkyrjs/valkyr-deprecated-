import { Document, IndexedDatabase } from "@valkyr/db";
import type { Edge, Viewport } from "reactflow";

import type { Block } from "~Blocks/Block.Collection";

import type { EditorNode } from "../Modules/Editor/Nodes/Node.Collection";

export type Collections = {
  blocks: Block;
  viewports: Document<Viewport>;
  nodes: EditorNode;
  edges: Edge;
};

export const db = new IndexedDatabase<Collections>({
  name: "valkyr:editor",
  version: 1,
  registrars: [
    {
      name: "blocks",
      indexes: [["type"], ["name", { unique: true }]]
    },
    {
      name: "viewports"
    },
    {
      name: "nodes",
      indexes: [["type"]]
    },
    {
      name: "edges",
      indexes: [["type"]]
    }
  ],
  log: (event) => {
    if (event.type !== "query") {
      console.log(event);
    }
  }
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
