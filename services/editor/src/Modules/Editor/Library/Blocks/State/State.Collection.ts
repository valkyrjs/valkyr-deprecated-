import { Document } from "@valkyr/db";

import { db } from "~Services/Database";

import { addEditorNode } from "../../../Nodes/Node.Collection";
import { BlockField } from "../../Utilities/BlockFields";

export type StateBlock = Document<{
  name: string;
  data: BlockField[];
}>;

/*
 |--------------------------------------------------------------------------------
 | Helpers
 |--------------------------------------------------------------------------------
 */

export async function createStateBlock({ name = "", data = [["name", "p:string"]] }: StateBlock): Promise<string> {
  const result = await db.collection("states").insertOne({ name, data });
  if (result.acknowledged === false) {
    throw new Error("Failed to create state block");
  }
  await addEditorNode("state", result.insertedId);
  return result.insertedId;
}
