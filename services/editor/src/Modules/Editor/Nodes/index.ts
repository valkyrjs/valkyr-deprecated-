import { ComponentType } from "react";
import { NodeProps } from "reactflow";

import { EventNode } from "./Components/EventNode.Component";
import { ReducerNode } from "./Components/ReducerNode.Component";
import { StateNode } from "./Components/StateNode.Component";
import { NodeType } from "./Node.Types";

export const nodeTypes: Record<NodeType, ComponentType<NodeProps>> = {
  event: EventNode,
  state: StateNode,
  reducer: ReducerNode
};
