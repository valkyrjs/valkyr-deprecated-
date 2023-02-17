import { EventNode } from "~Modules/Event";
import { ReducerNode, StateNode } from "~Modules/Reducer";
import { ValidatorNode } from "~Modules/Validator";

export const nodeTypes = {
  event: EventNode,
  state: StateNode,
  reducer: ReducerNode,
  validator: ValidatorNode
} as const;

export type NodeType = keyof typeof nodeTypes;

export type ConnectionParams = {
  type: string;
  id: string;
};
