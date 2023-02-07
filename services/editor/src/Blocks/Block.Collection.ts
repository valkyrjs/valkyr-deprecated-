import type { Document } from "@valkyr/db";

import type { BlockField } from "./Block.Fields";
import { createDatabaseBlock, DatabaseConfig } from "./Database";
import { createEventBlock } from "./Event";
import { createReducerBlock } from "./Reducer";
import { createStateBlock } from "./State";
import { createTypeBlock } from "./Type";
import { createValidatorBlock } from "./Validator";

/*
 |--------------------------------------------------------------------------------
 | Document
 |--------------------------------------------------------------------------------
 */

export type BlockDocument = Document<
  {
    name: string;
  } & (
    | {
        type: "database";
        config: DatabaseConfig;
      }
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
        context: string[];
      }
    | {
        type: "type";
        value: string;
      }
  )
>;

/*
 |--------------------------------------------------------------------------------
 | Subtypes
 |--------------------------------------------------------------------------------
 */

export type DatabaseBlock = Extract<BlockDocument, { type: "database" }>;
export type EventBlock = Extract<BlockDocument, { type: "event" }>;
export type ReducerBlock = Extract<BlockDocument, { type: "reducer" }>;
export type StateBlock = Extract<BlockDocument, { type: "state" }>;
export type ValidatorBlock = Extract<BlockDocument, { type: "validator" }>;
export type TypeBlock = Extract<BlockDocument, { type: "type" }>;

/*
 |--------------------------------------------------------------------------------
 | Helpers
 |--------------------------------------------------------------------------------
 */

export async function addBlock(type: BlockType, data: any): Promise<string> {
  switch (type) {
    case "database": {
      return createDatabaseBlock(data);
    }
    case "type": {
      return createTypeBlock(data);
    }
    case "event": {
      return createEventBlock(data);
    }
    case "state": {
      return createStateBlock(data);
    }
    case "reducer": {
      return createReducerBlock(data);
    }
    case "validator": {
      return createValidatorBlock(data);
    }
    default: {
      throw new Error(`Unknown node type: ${type}`);
    }
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type BlockType = BlockDocument["type"];
