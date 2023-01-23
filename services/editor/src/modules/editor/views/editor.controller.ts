import { Controller } from "@valkyr/react";
import { addEdge, applyEdgeChanges, applyNodeChanges, Edge, EdgeChange, Node, NodeChange, NodeTypes } from "reactflow";

import { db } from "~services/database";

import { EventNode } from "../nodes/event.node";
import { NodeManager } from "../services/NodeManager";

export class EditorController extends Controller<{
  nodeTypes: NodeTypes;
  nodes: Node[];
  edges: Edge[];
}> {
  #nodeManager = new NodeManager();

  async onInit() {
    return {
      nodeTypes: {
        event: EventNode
      },
      nodes: await db.collection("nodes").find(),
      edges: await db.collection("edges").find()
    };
  }

  async addNode(node: Omit<Node, "id">): Promise<void> {
    const result = await db.collection("nodes").insertOne(node);
    this.setState("nodes", [
      ...this.state.nodes,
      {
        ...node,
        id: result.documents[0].id
      }
    ]);
  }

  onNodesChange(changes: NodeChange[]): void {
    this.setState("nodes", applyNodeChanges(changes, this.state.nodes));
    this.#nodeManager.addNodeChanges(changes);
  }

  onEdgesChange(changes: EdgeChange[]): void {
    this.setState("edges", applyEdgeChanges(changes, this.state.edges));
  }

  onConnect(params: any): void {
    this.setState("edges", addEdge(params, this.state.edges));
  }
}
