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

export type TypeData = {
  name: string;
  data: NodeTypeFields;
} & NodeTypeCache;
