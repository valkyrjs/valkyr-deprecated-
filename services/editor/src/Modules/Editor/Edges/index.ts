import { ComponentType } from "react";
import { EdgeProps } from "reactflow";

import { BlockEdge } from "./BlockEdge.Component";

export const edgeTypes: Record<"block", ComponentType<EdgeProps>> = {
  block: BlockEdge
};
