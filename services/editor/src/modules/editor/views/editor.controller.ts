import { Controller } from "@valkyr/react";
import { Connection, Edge, Node, ReactFlowInstance } from "reactflow";

import { edges, nodes } from "~services/database";

import { EventNode } from "../nodes/event/event.component";
import { ReducerNode } from "../nodes/reducer/reducer.component";
import { TypeNode } from "../nodes/type/type.component";

export const nodeTypes = {
  event: EventNode,
  reducer: ReducerNode,
  type: TypeNode
};

export class EditorController extends Controller<{
  nodes: Node[];
  edges: Edge[];
  asideOpen: boolean;
}> {
  #instance?: ReactFlowInstance;

  async onInit() {
    return {
      nodes: await this.query(nodes, {}, async (list) => {
        this.#instance?.addNodes(list);
        return {
          nodes: list
        };
      }),
      edges: await edges.find(),
      asideOpen: false
    };
  }

  setInstance(instance: ReactFlowInstance) {
    this.#instance = instance;
  }

  toggleAside(state: boolean) {
    this.setState("asideOpen", state);
  }

  onNodePositionChanged(_: any, node: Node): void {
    nodes.findOne({ id: node.id }).then((current) => {
      if (nodePositionChanged(current, node) === true) {
        nodes.updateOne(
          { id: node.id },
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

  onConnect(connection: Connection): void {
    const { source, target } = connection;
    if (source !== null && target !== null) {
      edges.insertOne({
        id: `reactflow__edge-${source}-${target}`,
        source,
        target
      });
    }
  }
}

function nodePositionChanged(current: Node | undefined, node: Node): boolean {
  if (current === undefined) {
    return true;
  }
  if (current.position.x !== node.position.x) {
    return true;
  }
  if (current.position.y !== node.position.y) {
    return true;
  }
  return false;
}
