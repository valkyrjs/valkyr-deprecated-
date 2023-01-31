import { Controller } from "@valkyr/react";
import { applyNodeChanges, Connection, Edge, Node, NodeChange } from "reactflow";

import { db } from "~Services/Database";

import { addReducerEdge } from "../Library/Blocks/Reducer/Reducer.Collection";
import type { EditorNode } from "../Nodes/Node.Collection";

export class EditorController extends Controller<{
  nodes: EditorNode[];
  edges: Edge[];
  asideOpen: boolean;
}> {
  async onInit() {
    return {
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
      if (change.type === "dimensions") {
        const { id, dimensions } = change;
        if (dimensions) {
          const { width, height } = dimensions;
          db.collection("nodes")
            .findOne({ id, height, width })
            .then((node) => {
              if (node === undefined) {
                db.collection("nodes").updateOne({ id }, { $set: { width, height } });
              }
            });
        }
      }
    });
  }

  onNodePositionChanged(_: any, node: Node): void {
    db.collection("nodes")
      .findOne({
        id: node.id,
        position: node.position,
        positionAbsolute: node.positionAbsolute
      })
      .then((document) => {
        if (document === undefined) {
          db.collection("nodes").updateOne(
            {
              id: node.id
            },
            {
              $set: {
                position: node.position,
                positionAbsolute: node.positionAbsolute
              }
            }
          );
        }
      });
  }

  async onConnect(connection: Connection): Promise<void> {
    const { source, target } = connection;

    if (source === null || target === null) {
      return;
    }

    const sourceNode = await db.collection("nodes").findById(source);
    const targetNode = await db.collection("nodes").findById(target);

    if (sourceNode === undefined || targetNode === undefined) {
      return;
    }

    let connected = false;
    switch (targetNode.type) {
      case "reducer": {
        const result = await addReducerEdge({ type: sourceNode.type, id: sourceNode.data.id }, targetNode.data.id);
        if (result === true) {
          connected = true;
        }
        break;
      }
    }

    if (connected) {
      db.collection("edges").insertOne({
        id: `reactflow__edge-${source}-${target}`,
        source,
        target
      });
    }
  }
}
