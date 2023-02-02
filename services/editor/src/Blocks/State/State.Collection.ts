import { db } from "~Services/Database";

import { StateBlock } from "../Block.Collection";

/*
 |--------------------------------------------------------------------------------
 | Helpers
 |--------------------------------------------------------------------------------
 */

export async function createStateBlock({ name = "", data = [["name", "p:string"]] }: StateBlock): Promise<string> {
  const result = await db.collection<StateBlock>("blocks").insertOne({ type: "state", name, data });
  if (result.acknowledged === false) {
    throw new Error("Failed to create state block");
  }
  return result.insertedId;
}
