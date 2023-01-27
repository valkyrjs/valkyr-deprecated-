import { db } from "~services/database";
import { format } from "~services/prettier";
import { toType } from "~services/types";

import type { EventData } from "./event/event.node";

export function getEventCache(event: EventData): string {
  const data = getFieldsArray(event.data);
  const meta = getFieldsArray(event.meta);
  if (data.length === 0 && meta.length === 0) {
    return format(`type ${event.name} = LedgerEvent<"${event.name}">;`);
  }
  if (data.length > 0 && meta.length === 0) {
    return format(`type ${event.name} = LedgerEvent<"${event.name}",Required<{${data.join("")}}>>`);
  }
  if (data.length === 0 && meta.length > 0) {
    return format(`type ${event.name} = LedgerEvent<"${event.name}",{},Required<{${meta.join("")}}>>`);
  }
  if (data.length > 0 && meta.length > 0) {
    return format(
      `type ${event.name} = LedgerEvent<"${event.name}",Required<{${data.join("")}}>,Required<{${meta.join("")}}>>`
    );
  }
  return "";
}

export function getEventRecordCache(events: string[]): string {
  if (events.length === 0) {
    return "";
  }
  return `type EventRecord = ${events.map((name) => `LedgerEventRecord<${name}>`).join(" | ")};`;
}

export function getTypeCache(name: string, fields: NodeTypeFields): string {
  return `type ${name} = {${getFields(fields)}};`;
}

export function getInterfaceCache(name: string, fields: NodeTypeFields): string {
  return `interface ${name} {${getFields(fields)}};`;
}

function getFields(fields: NodeTypeFields): string {
  return getFieldsArray(fields).join("\n");
}

function getFieldsArray(fields: NodeTypeFields): string[] {
  const result = [];
  for (const [key, type] of fields) {
    if (key === "") {
      continue; // do not add empty keys
    }
    result.push(`${key}:${toType(type)};`);
  }
  return result;
}

export type NodeTypeFields = [string, string][];

export type NodeTypeCache = {
  cache: string;
};

export async function getPosition(type: string): Promise<{ x: number; y: number }> {
  const nodes = await db.collection("nodes").find({ type });
  const maxY = nodes.length ? Math.max(...nodes.map((n) => n.position.y)) : 100;
  const maxNode = nodes.find((n) => n.position.y === maxY);
  return maxNode
    ? {
        x: maxNode?.position.x,
        y: maxNode?.position.y + (maxNode?.height || 0) + 20
      }
    : { x: 100, y: 100 };
}
