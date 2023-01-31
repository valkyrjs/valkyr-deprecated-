import { createEventBlock } from "./Event/Event.Collection";
import { createReducerBlock } from "./Reducer/Reducer.Collection";
import { createStateBlock } from "./State/State.Collection";
import { createTypeBlock } from "./Type/Type.Collection";

export type BlockType = "type" | "event" | "state" | "reducer";

export async function addBlock(type: BlockType): Promise<void> {
  switch (type) {
    case "type": {
      return createTypeBlock();
    }
    case "event": {
      return createEventBlock();
    }
    case "state": {
      return createStateBlock();
    }
    case "reducer": {
      return createReducerBlock();
    }
    default: {
      throw new Error(`Unknown node type: ${type}`);
    }
  }
}
