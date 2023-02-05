import { BlockType } from "./Block.Collection";
import { createEventBlock } from "./Event/Event.Collection";
import { createReducerBlock } from "./Reducer/Reducer.Collection";
import { createStateBlock } from "./State/State.Collection";
import { createTypeBlock } from "./Type/Type.Collection";
import { createValidatorBlock } from "./Validator/Validator.Collection";

export async function addBlock(type: BlockType, data: any): Promise<string> {
  switch (type) {
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
    case "validator":
    case "reducer": {
      return {
        stroke: "stroke-cyan-600",
        strokeHover: "hover:stroke-cyan-400",
        bg: "bg-cyan-600",
        bgHover: "hover:bg-cyan-400",
        border: "border-cyan-600",
        borderHover: "hover:border-cyan-400"
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
