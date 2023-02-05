import { Controller } from "@valkyr/react";
import { addEdge, applyNodeChanges, Connection, Edge, Node, NodeChange } from "reactflow";

import { db } from "~Services/Database";

import { edges } from "../Edges/ConnectionManager";
import type { EditorNode } from "../Nodes/Node.Collection";
import { setNodeConnection } from "../Nodes/Utilities/Node.Connect";
import { setNodeDimensions } from "../Nodes/Utilities/Node.Dimensions";
import { setNodePosition } from "../Nodes/Utilities/Node.Position";

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

  async onConnect(connection: Connection): Promise<void> {
    const { source, target } = connection;
    if (source === null || target === null) {
      return;
    }
    setNodeConnection(source, target);
  }
}
