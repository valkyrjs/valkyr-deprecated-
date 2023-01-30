import { ComponentType } from "react";
import { NodeProps } from "reactflow";

import { EventNode } from "./components/event.node";
import { ReducerNode } from "./components/reducer.node";
import { StateNode } from "./components/state.node";
import { NodeType } from "./node.types";

export const nodeTypes: Record<NodeType, ComponentType<NodeProps>> = {
  event: EventNode,
  state: StateNode,
  reducer: ReducerNode
};
