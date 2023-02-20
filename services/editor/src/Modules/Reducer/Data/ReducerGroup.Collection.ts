import { Document } from "@valkyr/db";

import { db } from "./Reducer.Database";

export type ReducerGroupDocument = Document<{
  name: string;
}>;

export async function createReducerGroup(name: string): Promise<void> {
  await db.collection("groups").insertOne({ name });
}
