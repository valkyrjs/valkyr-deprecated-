import { IndexedDatabase } from "@valkyr/db";
import { Edge, Node } from "reactflow";

export const db = new IndexedDatabase<{
  nodes: Node;
  edges: Edge;
}>({
  name: "valkyr:editor",
  version: 1,
  registrars: [{ name: "nodes" }, { name: "edges" }],
  log: console.log
});

export const nodes = db.collection("nodes");
export const edges = db.collection("edges");
