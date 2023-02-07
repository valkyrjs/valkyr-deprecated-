import { Controller } from "@valkyr/react";
import { applyNodeChanges, Connection, Edge, Node, NodeChange, Viewport } from "reactflow";

import { NodeDocument } from "~ReactFlow/Data/Node.Collection";
import { setNodeConnection } from "~ReactFlow/Nodes/Node.Connect";
import { setNodeDimensions } from "~ReactFlow/Nodes/Node.Dimensions";
import { setNodePosition } from "~ReactFlow/Nodes/Node.Position";
import { db } from "~Services/Database";

export class EditorController extends Controller<{
  viewport?: Viewport;
  nodes: NodeDocument[];
  edges: Edge[];
  asideOpen: boolean;
}> {
  async onInit() {
    return {
      viewport: await db.collection("viewports").findOne({ id: "blocks" }),
      nodes: await this.query(db.collection("nodes"), {}, "nodes"),
      edges: await this.query(db.collection("edges"), {}, "edges"),
      asideOpen: false
    };
  }

  toggleAside(state: boolean) {
    this.setState("asideOpen", state);
  }

  onNodesChange(changes: NodeChange[]): void {
    this.setState("nodes", applyNodeChanges(changes, this.state.nodes));
    changes.forEach((change) => {
      switch (change.type) {
        case "dimensions": {
          const { id, dimensions } = change;
          if (dimensions !== undefined) {
            setNodeDimensions(id, dimensions);
          }
          break;
        }
      }
    });
  }

  onNodePositionChanged(_: any, node: Node): void {
    setNodePosition(node);
  }

  onViewportChanged(_: any, viewport: Viewport): void {
    db.collection("viewports")
      .findOne({ id: "blocks" })
      .then((document) => {
        if (document === undefined) {
          db.collection("viewports").insertOne({ id: "blocks", ...viewport });
        } else {
          db.collection("viewports").updateOne({ id: "blocks" }, { $set: viewport });
        }
      });
  }

  async onConnect(connection: Connection): Promise<void> {
    const { source, sourceHandle, target, targetHandle } = connection;
    if (source === null || target === null) {
      return;
    }
    setNodeConnection(
      { nodeId: source, handle: sourceHandle || undefined },
      { nodeId: target, handle: targetHandle || undefined }
    );
  }
}
