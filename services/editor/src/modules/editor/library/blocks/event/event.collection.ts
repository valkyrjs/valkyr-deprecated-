import { Document } from "@valkyr/db";

import { db } from "~services/database";
import { format } from "~services/prettier";

import { addEditorNode } from "../../../nodes/node.collection";
import { BlockField, getFieldsArray } from "../../utilities/block-fields";

export type EventBlock = Document<{
  name: string;
  data: BlockField[];
  meta: BlockField[];
}>;

/*
 |--------------------------------------------------------------------------------
 | Helpers
 |--------------------------------------------------------------------------------
 */

export async function createEventBlock() {
  const result = await db.collection("events").insertOne({
    name: "FooCreated",
    data: [["", "p:string"]],
    meta: []
  });
  if (result.acknowledged === false) {
    throw new Error("Failed to create event block");
  }
  await addEditorNode("event", result.insertedId);
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

export function getEventDataTypes(event: EventBlock): string {
  const data = getFieldsArray(event.data);
  const meta = getFieldsArray(event.meta);
  if (data.length === 0 && meta.length === 0) {
    return format(`type ${event.name} = LedgerEvent<"${event.name}">;`);
  }
  if (data.length > 0 && meta.length === 0) {
    return format(`type ${event.name} = LedgerEvent<"${event.name}",Required<{${data.join("")}}>>;`);
  }
  if (data.length === 0 && meta.length > 0) {
    return format(`type ${event.name} = LedgerEvent<"${event.name}",{},Required<{${meta.join("")}}>>;`);
  }
  if (data.length > 0 && meta.length > 0) {
    return format(
      `type ${event.name} = LedgerEvent<"${event.name}",Required<{${data.join("")}}>,Required<{${meta.join("")}}>>;`
    );
  }
  return "";
}

export function getEventNamesRecord(events: string[]): string {
  if (events.length === 0) {
    return "";
  }
  return `type EventRecord = ${events.map((name) => `LedgerEventRecord<${name}>`).join(" | ")};`;
}
