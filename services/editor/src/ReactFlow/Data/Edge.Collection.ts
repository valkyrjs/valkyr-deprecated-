import { Edge } from "reactflow";

import { Connection } from "~ReactFlow/Nodes/Node.Connect";
import { NodeType } from "~ReactFlow/Nodes/Node.Types";
import { db } from "~Services/Database";

export type EdgeDocument = Edge;

/*
 |--------------------------------------------------------------------------------
 | Helpers
 |--------------------------------------------------------------------------------
 */

export async function addEdge(sourceType: NodeType, source: Connection, target: Connection): Promise<void> {
  if (source)
    await db.collection("edges").insertOne({
      id: `${source.nodeId}-${target.nodeId}`,
      type: "block",
      source: source.nodeId,
      sourceHandle: source.handle,
      target: target.nodeId,
      targetHandle: target.handle,
      animated: true,
      data: {
        sourceType
      }
    });
}

export async function removeEdge(sourceId: string, targetId: string): Promise<void> {
  await db.collection("edges").remove({ id: `${sourceId}-${targetId}` });
}
