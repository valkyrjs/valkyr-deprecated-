import { db } from "~services/database";
import { format } from "~services/prettier";
import { toType } from "~services/types";

export function addReducerNode(): void {
  db.collection("nodes").insertOne({
    type: "reducer",
    position: { x: 0, y: 0 },
    dragHandle: ".node-drag-handle",
    data: {
      type: "reducer",
      config: {
        events: [],
        state: [],
        code: format(`
        async function reduce(state: State, event: EventRecord): Promise<State> {
          // write your reducer logic here ...
        };
        `)
      },
      monaco: {
        model: format(`
          type State = {};
        `)
      }
    }
  });
}

export function getStateType(record: [string, string][]): string {
  const result = [];
  for (const [key, type] of record) {
    if (key === "") {
      continue; // do not add empty keys
    }
    result.push(`${key}:${toType(type)};`);
  }
  return `type State = {${result.join("")}};`;
}

export type ReducerNodeData = {
  type: "reducer";
  config: {
    events: string[];
    state: [string, string][];
    code: string;
  };
  monaco: {
    model: string;
  };
};
