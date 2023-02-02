import { db } from "~Services/Database";

import { TypeBlock } from "../Block.Collection";

/*
 |--------------------------------------------------------------------------------
 | Helpers
 |--------------------------------------------------------------------------------
 */

export async function createTypeBlock({ name = "", data = [["name", "p:string"]] }: TypeBlock): Promise<string> {
  const result = await db.collection<TypeBlock>("blocks").insertOne({ type: "type", name, data });
  if (result.acknowledged === false) {
    throw new Error("Failed to create type block");
  }
  return result.insertedId;
}
