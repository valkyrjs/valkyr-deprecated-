import { Node } from "reactflow";

import { NodeType } from "~ReactFlow/Nodes/Node.Types";
import { db } from "~Services/Database";

export type NodeDocument = Node<{
  blockId: string;
}>;

/*
 |--------------------------------------------------------------------------------
 | Helpers
 |--------------------------------------------------------------------------------
 */

export async function addNode(type: NodeType, blockId: string): Promise<void> {
  db.collection("nodes").insertOne({
    type,
    position: await getNodePosition(type),
    dragHandle: ".node-drag-handle",
    data: { blockId }
  });
}

export async function getNodePosition(type: string): Promise<{ x: number; y: number }> {
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
