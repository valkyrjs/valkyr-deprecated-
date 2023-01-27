import { ComponentType } from "react";
import { NodeProps } from "reactflow";

import { EventNode } from "./event/event.component";
import { getEventData } from "./event/event.node";
import { getPosition } from "./node.utils";
import { ReducerNode } from "./reducer/reducer.component";
import { getReducerData } from "./reducer/reducer.node";
import { StateNode } from "./state/state.component";
import { getStateData } from "./state/state.node";
import { TypeNode } from "./type/type.component";
import { getTypeData } from "./type/type.node";
import { ValidatorNode } from "./validator/validator.component";
import { getValidatorData } from "./validator/validator.node";

export * from "./node.fields";
export * from "./node.utils";

export type NodeType = "type" | "event" | "state" | "reducer" | "validator";

export const nodeTypes: Record<NodeType, ComponentType<NodeProps>> = {
  event: EventNode,
  reducer: ReducerNode,
  validator: ValidatorNode,
  state: StateNode,
  type: TypeNode
};

export async function getNode(type: NodeType) {
  switch (type) {
    case "type": {
      return {
        type,
        position: await getPosition(type),
        dragHandle: ".node-drag-handle",
        data: getTypeData()
      };
    }
    case "event": {
      return {
        type,
        position: await getPosition(type),
        dragHandle: ".node-drag-handle",
        data: getEventData("AccountCreated", [
          ["email", "p:string"],
          ["password", "p:string"]
        ])
      };
    }
    case "state": {
      return {
        type,
        position: await getPosition(type),
        dragHandle: ".node-drag-handle",
        data: getStateData()
      };
    }
    case "reducer": {
      return {
        type,
        position: await getPosition(type),
        dragHandle: ".node-drag-handle",
        data: getReducerData()
      };
    }
    case "validator": {
      return {
        type,
        position: await getPosition(type),
        dragHandle: ".node-drag-handle",
        data: getValidatorData()
      };
    }
    default: {
      throw new Error(`Unknown node type: ${type}`);
    }
  }
}
