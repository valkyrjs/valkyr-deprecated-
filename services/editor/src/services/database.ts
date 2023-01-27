import { IndexedDatabase } from "@valkyr/db";
import { Edge, Node } from "reactflow";

import { Type } from "../modules/editor/nodes/type/type.node";

export const db = new IndexedDatabase<{
  nodes: Node;
  edges: Edge;
  types: Type;
}>({
  name: "valkyr:editor",
  version: 1,
  registrars: [{ name: "nodes" }, { name: "edges" }, { name: "types" }],
  log: console.log
});
