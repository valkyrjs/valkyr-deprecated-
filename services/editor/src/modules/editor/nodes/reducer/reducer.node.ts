import { db } from "~services/database";
import { format } from "~services/prettier";

export function addReducerNode(): void {
  db.collection("nodes").insertOne({
    type: "reducer",
    position: { x: 0, y: 0 },
    dragHandle: ".node-drag-handle",
    data: getReducerData()
  });
}

function getReducerData(): ReducerData {
  return {
    name: "reducer",
    value: format(`
      async function reduce(state: State, event: EventRecord): Promise<State> {
        // write your reducer logic here ...
      };
    `)
  };
}

export type ReducerData = {
  name: string;
  value: string;
};
