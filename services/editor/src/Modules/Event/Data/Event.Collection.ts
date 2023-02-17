import { Document } from "@valkyr/db";

import { DataField } from "~Library/DataField";

import { db } from "./Event.Database";

export type EventDocument = Document<{
  groupId: string;
  name: string;
  data: DataField[];
  meta: DataField[];
}>;

export async function createEvent(groupId: string, name = "FooCreated"): Promise<void> {
  await db
    .collection("events")
    .insertOne({ groupId, name, data: [["foo", "p:string"]], meta: [["container", "p:string"]] });
}
