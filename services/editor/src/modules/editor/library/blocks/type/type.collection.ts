import { Document } from "@valkyr/db";

import { db } from "~services/database";

import { BlockField } from "../../utilities/block-fields";

export type TypeBlock = Document<{
  name: string;
  data: BlockField[];
}>;

/*
 |--------------------------------------------------------------------------------
 | Helpers
 |--------------------------------------------------------------------------------
 */

export async function createTypeBlock(): Promise<void> {
  const result = await db.collection("types").insertOne({
    name: "Foo",
    data: [["", "p:string"]]
  });
  if (result.acknowledged === false) {
    throw new Error("Failed to create type block");
  }
}
