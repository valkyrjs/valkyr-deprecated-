import { IndexedDatabase } from "@valkyr/db";

import type { BlockDocument } from "~Blocks/Block.Collection";
import type { EdgeDocument } from "~ReactFlow/Data/Edge.Collection";
import type { NodeDocument } from "~ReactFlow/Data/Node.Collection";
import type { ViewportDocument } from "~ReactFlow/Data/Viewport.Collection";

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
  ]
});

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Collections = {
  blocks: BlockDocument;
  viewports: ViewportDocument;
  nodes: NodeDocument;
  edges: EdgeDocument;
};

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
