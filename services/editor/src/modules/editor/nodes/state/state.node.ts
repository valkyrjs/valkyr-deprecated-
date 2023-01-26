import { db } from "~services/database";
import { format } from "~services/prettier";

import { NodeTypeCache, NodeTypeFields } from "../node.utils";

export function addStateNode(): void {
  db.collection("nodes").insertOne({
    type: "state",
    position: { x: 0, y: 0 },
    dragHandle: ".node-drag-handle",
    data: getStateData()
  });
}

function getStateData(): StateData {
  return {
    name: "State",
    data: [["", "p:string"]],
    cache: format(`
      interface State {};
    `)
  };
}

export type StateData = {
  name: string;
  data: NodeTypeFields;
} & NodeTypeCache;
