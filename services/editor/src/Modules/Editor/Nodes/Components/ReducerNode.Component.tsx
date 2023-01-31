import { Handle, Position } from "reactflow";

import { ReducerBlock } from "../../Library/Blocks/Reducer/Reducer.Component";
import { ReducerNodeController } from "./ReducerNode.Controller";

export const ReducerNode = ReducerNodeController.view(
  ({
    props: {
      data: { id }
    }
  }) => {
    return (
      <div className="relative">
        <Handle type="target" position={Position.Left} />
        <ReducerBlock id={id} />
        <Handle type="source" position={Position.Right} />
      </div>
    );
  }
);
