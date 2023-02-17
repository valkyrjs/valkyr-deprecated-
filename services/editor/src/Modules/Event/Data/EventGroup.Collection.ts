import { Document } from "@valkyr/db";

import { db } from "./Event.Database";

export type EventGroupDocument = Document<{
  name: string;
}>;

export async function createEventGroup(name: string): Promise<void> {
  await db.collection("groups").insertOne({ name });
}
