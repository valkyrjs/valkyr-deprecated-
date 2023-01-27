import { db } from "~services/database";

import { getPosition, NodeTypeFields } from "../node.utils";

const type = "event";

export async function addEventNode(
  name = "EventNamed",
  data: NodeTypeFields = [["", "p:string"]],
  meta: NodeTypeFields = []
): Promise<void> {
  db.collection("nodes").insertOne({
    type,
    position: await getPosition(type),
    dragHandle: ".node-drag-handle",
    data: getEventData(name, data, meta)
  });
}

export function getEventData(
  name = "EventNamed",
  data: NodeTypeFields = [["", "p:string"]],
  meta: NodeTypeFields = []
): EventData {
  return {
    name,
    data,
    meta
  };
}

export type EventData = {
  name: string;
  data: NodeTypeFields;
  meta: NodeTypeFields;
};

/*
async function getNode(type: string) {
  switch (type) {
    case "event":
    default: {
      return {
        type,
        position: await getPosition(type),
        dragHandle: ".node-drag-handle",
        data: getEventData("AccountCreated", [
          ["email", "p:string"],
          ["password", "p:string"]
        ])
      };
    }
  }
}
*/
