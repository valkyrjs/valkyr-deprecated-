import { Document } from "@valkyr/db";

import { db } from "~services/database";

import { getPosition, NodeTypeFields } from "../node.utils";

const type = "type";

export async function addTypeNode(): Promise<void> {
  db.collection("nodes").insertOne({
    type,
    position: await getPosition(type),
    dragHandle: ".node-drag-handle",
    data: getTypeData()
  });
}

export function getTypeData(): TypeData {
  return {
    name: "Foo",
    data: [["", "p:string"]]
  };
}

export type Type = Document<{
  type: "type";
  data: TypeData;
}>;

export type TypeData = {
  name: string;
  data: NodeTypeFields;
};
