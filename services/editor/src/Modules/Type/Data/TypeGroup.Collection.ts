import { Document } from "@valkyr/db";

import { db } from "./Type.Database";

export type TypeGroupComponent = Document<{
  name: string;
}>;

export async function createTypeGroup(name: string): Promise<void> {
  await db.collection("groups").insertOne({ name });
}
