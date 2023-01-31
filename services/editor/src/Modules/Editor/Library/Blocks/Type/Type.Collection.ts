import { Document } from "@valkyr/db";

import { db } from "~Services/Database";

import { BlockField } from "../../Utilities/BlockFields";

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
    name: "",
    data: [["", "p:string"]]
  });
  if (result.acknowledged === false) {
    throw new Error("Failed to create type block");
  }
}
