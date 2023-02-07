import { BlockType } from "./Block.Collection";

export function getColors(sourceType: BlockType) {
  switch (sourceType) {
    case "database": {
      return {
        stroke: "stroke-green-600",
        strokeHover: "hover:stroke-green-400",
        bg: "bg-green-600",
        bgHover: "hover:bg-green-400",
        border: "border-green-600",
        borderHover: "hover:border-green-400"
      };
    }
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
