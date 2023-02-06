import { ComponentType } from "react";
import { NodeProps } from "reactflow";

import { DatabaseNode } from "./Components/DatabaseNode.Component";
import { EventNode } from "./Components/EventNode.Component";
import { ReducerNode } from "./Components/ReducerNode.Component";
import { StateNode } from "./Components/StateNode.Component";
import { ValidatorNode } from "./Components/ValidatorNode.Component";
import { NodeType } from "./Utilities/Node.Types";

export const nodeTypes: Record<NodeType, ComponentType<NodeProps>> = {
  database: DatabaseNode,
  event: EventNode,
  state: StateNode,
  reducer: ReducerNode,
  validator: ValidatorNode
};
