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

export function getColors(sourceType: BlockType) {
  switch (sourceType) {
    case "event": {
      return {
        stroke: "stroke-orange-600",
        strokeHover: "hover:stroke-orange-400",
        bg: "bg-orange-600",
        bgHover: "hover:bg-orange-400",
        border: "border-orange-600",
        borderHover: "hover:border-orange-400"
      };
    }
    case "state": {
      return {
        stroke: "stroke-pink-600",
        strokeHover: "hover:stroke-pink-400",
        bg: "bg-pink-600",
        bgHover: "hover:bg-pink-400",
        border: "border-pink-600",
        borderHover: "hover:border-pink-400"
      };
    }
    default: {
      return {
        stroke: "stroke-dark-600",
        strokeHover: "hover:stroke-dark-400",
        bg: "bg-dark-600",
        bgHover: "hover:bg-dark-400",
        border: "border-dark-600",
        borderHover: "hover:border-dark-400"
      };
    }
  }
}
