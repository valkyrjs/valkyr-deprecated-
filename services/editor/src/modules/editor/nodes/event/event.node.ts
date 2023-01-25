import { db } from "~services/database";
import { format } from "~services/prettier";

export function addEventNode(): void {
  db.collection("nodes").insertOne({
    type: "event",
    position: { x: 20, y: 80 },
    dragHandle: ".node-drag-handle",
    data: {
      type: "event",
      config: {
        name: "FooCreated",
        data: [["", "p:string"]],
        meta: []
      },
      monaco: {
        model: format(`
          type FooCreated = LedgerEvent<"FooCreated">;
        `)
      }
    }
  });
}

export type EventNodeData = {
  type: "event";
  config: {
    name: string;
    data: [string, string][];
    meta: [string, string][];
  };
  monaco: {
    model: string;
  };
};
