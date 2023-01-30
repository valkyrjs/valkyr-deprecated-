import { Node } from "reactflow";

import { db } from "~services/database";

import { NodeType } from "./node.types";

export type EditorNode = Node<{
  id: string;
}> & {
  type: NodeType;
};

/*
 |--------------------------------------------------------------------------------
 | Helpers
 |--------------------------------------------------------------------------------
 */

export async function addEditorNode(type: NodeType, id: string): Promise<void> {
  db.collection("nodes").insertOne({
    type,
    position: await getPosition(type),
    dragHandle: ".node-drag-handle",
    data: { id }
  });
}

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
