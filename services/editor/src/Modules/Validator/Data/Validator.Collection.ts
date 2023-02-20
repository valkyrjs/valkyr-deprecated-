import { Document } from "@valkyr/db";

import { format } from "~Services/Prettier";

import { db } from "./Validator.Database";

const defaultValue = format(`
  api.validator.on("Event", async (event) => {
    // Enter your validation code here ...
  });
`);

export type ValidatorDocument = Document<{
  eventId?: string;
  name: string;
  value: string;
}>;

/*
 |--------------------------------------------------------------------------------
 | Helpers
 |--------------------------------------------------------------------------------
 */

export async function createValidatorBlock(name = crypto.randomUUID()): Promise<string> {
  const result = await db.collection("validators").insertOne({ name, value: defaultValue });
  if (result.acknowledged === false) {
    throw new Error("Failed to create validator block");
  }
  return result.insertedId;
}
