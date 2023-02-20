import { Document, IndexedDatabase } from "@valkyr/db";

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
      name: "code",
      indexes: [["name", { unique: true }]]
    },
    {
      name: "edges",
      indexes: [["type"]]
    },
    {
      name: "nodes",
      indexes: [["type"]]
    },
    {
      name: "viewports"
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
  code: CodeDocument;
  edges: EdgeDocument;
  nodes: NodeDocument;
  viewports: ViewportDocument;
};

export type CodeDocument = Document<{
  name: string;
  value: string;
}>;

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
