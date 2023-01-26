import { db } from "~services/database";
import { format } from "~services/prettier";
import { toType } from "~services/types";

export function addStateNode(): void {
  db.collection("nodes").insertOne({
    type: "state",
    position: { x: 0, y: 0 },
    dragHandle: ".node-drag-handle",
    data: {
      type: "state",
      config: {
        name: "Foo",
        data: [["", "p:string"]]
      },
      monaco: {
        model: format(`interface State {};`)
      }
    }
  });
}

export function generateState(record: [string, string][]): string {
  const result = [];
  for (const [key, type] of record) {
    if (key === "") {
      continue; // do not add empty keys
    }
    result.push(`${key}:${toType(type)};`);
  }
  return `interface State {${result.join("\n")}};`;
}

export type StateNodeData = {
  type: "state";
  config: {
    name: string;
    data: [string, string][];
  };
  monaco: {
    model: string;
  };
};
