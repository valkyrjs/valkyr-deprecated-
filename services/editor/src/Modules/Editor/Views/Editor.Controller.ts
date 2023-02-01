import { Controller } from "@valkyr/react";
import { addEdge, applyNodeChanges, Connection, Edge, Node, NodeChange } from "reactflow";

import { db } from "~Services/Database";

import { edges } from "../Edges/Edge.Utilities";
import { addReducerEdge } from "../Edges/Reducer.Edge";
import type { EditorNode } from "../Nodes/Node.Collection";

const edgeOptions = {
  animated: true
};

export class EditorController extends Controller<{
  nodes: EditorNode[];
  edges: Edge[];
  asideOpen: boolean;
}> {
  async onInit() {
    this.#subscriberToEdges();
    return {
      nodes: await this.query(db.collection("nodes"), {}, "nodes"),
      edges: [],
      asideOpen: false
    };
  }

  #subscriberToEdges() {
    this.subscribe(edges, async (action) => {
      switch (action.type) {
        case "add": {
          return this.setState(
            "edges",
            addEdge(
              {
                ...action.edge,
                ...edgeOptions
              },
              this.state.edges
            )
          );
        }
        case "remove": {
          return this.setState(
            "edges",
            this.state.edges.filter((edge) => edge.id !== action.id)
          );
        }
      }
    });
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

    if (
      sourceNode === undefined ||
      targetNode === undefined ||
      sourceNode.type === undefined ||
      targetNode.type === undefined
    ) {
      return;
    }

    console.log({
      sourceNode,
      targetNode,
      source,
      target
    });

    switch (targetNode.type) {
      case "reducer": {
        await addReducerEdge({ type: sourceNode.type, id: sourceNode.data.id }, targetNode.data.id);
        break;
      }
    }
  }
}
