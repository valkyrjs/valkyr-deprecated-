import { db } from "~services/database";

import { getPosition, NodeTypeFields } from "../node.utils";

const type = "state";

export async function addStateNode(): Promise<void> {
  db.collection("nodes").insertOne({
    type,
    position: await getPosition(type),
    dragHandle: ".node-drag-handle",
    data: getStateData()
  });
}

export function getStateData(): StateData {
  return {
    name: "State",
    data: [["", "p:string"]]
  };
}

export type StateData = {
  name: string;
  data: NodeTypeFields;
};
