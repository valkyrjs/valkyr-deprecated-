import { Controller } from "@valkyr/react";
import { addEdge, applyNodeChanges, Connection, Edge, Node, NodeChange } from "reactflow";

import { ReducerBlock } from "~Blocks/Block.Collection";
import { db } from "~Services/Database";

import { edges } from "../Edges/ConnectionManager";
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

    switch (targetNode.type) {
      case "reducer": {
        await connectReducerEvent(sourceNode, targetNode);
        break;
      }
      case "state": {
        await connectStateReducer(sourceNode, targetNode);
        break;
      }
    }
  }
}

async function connectReducerEvent(sourceNode: Node, targetNode: Node): Promise<void> {
  console.log({ connect: "eventToReducer", sourceNode, targetNode });
  if (sourceNode.type !== "event") {
    throw new Error("Source node is not an event");
  }
  await db.collection<ReducerBlock>("blocks").updateOne(
    { id: targetNode.data.id },
    {
      $push: {
        events: sourceNode.data.id
      }
    }
  );
}

async function connectStateReducer(sourceNode: Node, targetNode: Node): Promise<void> {
  console.log({ connect: "reducerToState", sourceNode, targetNode });
  if (sourceNode.type !== "reducer") {
    throw new Error("Source node is not a reducer");
  }
  await db.collection<ReducerBlock>("blocks").updateOne(
    { id: sourceNode.data.id },
    {
      $set: {
        state: targetNode.data.id
      }
    }
  );
}
