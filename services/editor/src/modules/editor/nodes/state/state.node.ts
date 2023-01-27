import { format } from "~services/prettier";

import { NodeTypeCache, NodeTypeFields } from "../node.utils";

export function getStateData(): StateData {
  return {
    name: "State",
    data: [["", "p:string"]],
    cache: format(`
      interface State {};
    `)
  };
}

export type StateData = {
  name: string;
  data: NodeTypeFields;
} & NodeTypeCache;
