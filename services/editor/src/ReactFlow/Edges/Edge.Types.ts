import { ComponentType } from "react";
import { EdgeProps } from "reactflow";

import { BlockEdge } from "./Components/Edge.Component";

export const edgeTypes: Record<"block", ComponentType<EdgeProps>> = {
  block: BlockEdge
};
