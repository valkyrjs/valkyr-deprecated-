import { db } from "~services/database";
import { format } from "~services/prettier";

import { NodeTypeCache, NodeTypeFields } from "../node.utils";

export function addEventNode(): void {
  db.collection("nodes").insertOne({
    type: "event",
    position: { x: 20, y: 80 },
    dragHandle: ".node-drag-handle",
    data: getEventData()
  });
}

function getEventData(): EventData {
  return {
    name: "Foo",
    data: [["", "p:string"]],
    meta: [],
    cache: format(`
      type FooCreated = LedgerEvent<"FooCreated">;
    `)
  };
}

export type EventData = {
  name: string;
  data: NodeTypeFields;
  meta: NodeTypeFields;
} & NodeTypeCache;
