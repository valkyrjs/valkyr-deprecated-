import { createEventBlock } from "./event/event.collection";
import { createReducerBlock } from "./reducer/reducer.collection";
import { createStateBlock } from "./state/state.collection";
import { createTypeBlock } from "./type/type.collection";

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
