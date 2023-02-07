import { BlockModels } from "~Blocks/Block.Models";
import { db } from "~Services/Database";

import { TypeBlock } from "../../Block.Collection";

/*
 |--------------------------------------------------------------------------------
 | Helpers
 |--------------------------------------------------------------------------------
 */

export async function createTypeBlock({ name = "" }: Partial<TypeBlock> = {}): Promise<string> {
  const result = await db.collection<TypeBlock>("blocks").insertOne({ type: "type", name, value: "" });
  if (result.acknowledged === false) {
    throw new Error("Failed to create type block");
  }
  return result.insertedId;
}

/*
 |--------------------------------------------------------------------------------
 | Monaco
 |--------------------------------------------------------------------------------
 */

const models = new BlockModels();

db.collection<TypeBlock>("blocks").subscribe({ type: "type" }, {}, (types) => {
  models.flush();
  for (const type of types) {
    models.add(type.value);
  }
});
