import { db } from "~services/database";
import { format } from "~services/prettier";

import { getPosition } from "../node.utils";

const type = "reducer";

export async function addStateNode(): Promise<void> {
  db.collection("nodes").insertOne({
    type,
    position: await getPosition(type),
    dragHandle: ".node-drag-handle",
    data: getReducerData()
  });
}

export function getReducerData(): ReducerData {
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
