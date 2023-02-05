import { Document } from "@valkyr/db";

import { BlockField } from "./BlockFields";

export type Block = Document<
  {
    name: string;
  } & (
    | {
        type: "event";
        data: BlockField[];
        meta: BlockField[];
      }
    | {
        type: "reducer";
        value: string;
        events: string[];
        state?: string;
      }
    | {
        type: "state";
        data: BlockField[];
      }
    | {
        type: "validator";
        value: string;
        event?: string;
        context: BlockContext[];
      }
    | {
        type: "type";
        value: string;
      }
  )
>;

export type BlockContext = {
  blockId: string;
  key: string;
  value: string;
  settings?: Record<string, any>;
};

export type BlockType = Block["type"];

export type EventBlock = Extract<Block, { type: "event" }>;
export type ReducerBlock = Extract<Block, { type: "reducer" }>;
export type StateBlock = Extract<Block, { type: "state" }>;
export type ValidatorBlock = Extract<Block, { type: "validator" }>;
export type TypeBlock = Extract<Block, { type: "type" }>;
