import { db } from "~services/database";
import { format } from "~services/prettier";

import { NodeTypeCache, NodeTypeFields } from "../node.utils";

export function addTypeNode(): void {
  db.collection("nodes").insertOne({
    type: "type",
    position: { x: 20, y: 80 },
    dragHandle: ".node-drag-handle",
    data: getTypeData()
  });
}

function getTypeData(): TypeData {
  return {
    name: "Foo",
    data: [["", "p:string"]],
    cache: format(`
      type Foo = {};
    `)
  };
}

export type TypeData = {
  name: string;
  data: NodeTypeFields;
} & NodeTypeCache;
