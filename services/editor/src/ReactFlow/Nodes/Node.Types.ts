import { DatabaseNode } from "~Blocks/Database";
import { EventNode } from "~Blocks/Event";
import { ReducerNode } from "~Blocks/Reducer";
import { StateNode } from "~Blocks/State";
import { ValidatorNode } from "~Blocks/Validator";

export const nodeTypes = {
  database: DatabaseNode,
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
