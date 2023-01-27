import { Document } from "@valkyr/db";

import { format } from "~services/prettier";

import { NodeTypeCache, NodeTypeFields } from "../node.utils";

export function getTypeData(): TypeData {
  return {
    name: "Foo",
    data: [["", "p:string"]],
    cache: format(`
      type Foo = {};
    `)
  };
}

export type Type = Document<TypeData>;

export type TypeData = {
  name: string;
  data: NodeTypeFields;
} & NodeTypeCache;
