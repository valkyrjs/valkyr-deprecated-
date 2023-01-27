import { format } from "~services/prettier";

import { NodeTypeCache, NodeTypeFields } from "../node.utils";

export function getEventData(name = "EventNamed", data: NodeTypeFields = [["", "p:string"]]): EventData {
  return {
    name,
    data,
    meta: [],
    cache: format(`
      type EventNamed = LedgerEvent<"EventNamed">;
    `)
  };
}

export type EventData = {
  name: string;
  data: NodeTypeFields;
  meta: NodeTypeFields;
} & NodeTypeCache;
