import { Document } from "@valkyr/db";

import { db } from "~Services/Database";
import { format } from "~Services/Prettier";

import { BlockField, getFieldsArray } from "../BlockFields";

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

export async function createEventBlock({ name = "", data = [], meta = [] }: EventBlock): Promise<string> {
  const result = await db.collection("events").insertOne({ name, data, meta });
  if (result.acknowledged === false) {
    throw new Error("Failed to create event block");
  }
  return result.insertedId;
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
