import { Handle, Position } from "reactflow";

import { ReducerBlock } from "~Blocks/Reducer/Reducer.Component";

import { ReducerNodeController } from "./ReducerNode.Controller";

export const ReducerNode = ReducerNodeController.view(
  ({
    props: {
      data: { id }
    }
  }) => {
    return (
      <div className="relative">
        <div className="absolute top-1/2 -left-2 flex h-9 -translate-y-1/2 flex-col justify-center gap-1">
          <Handle type="target" id="events" className="h-3 w-2 bg-orange-600" position={Position.Left} />
        </div>
        <ReducerBlock id={id} />
        <div className="absolute top-1/2 -right-2 flex h-9 -translate-y-1/2 flex-col justify-center gap-1">
          <Handle type="source" id="reducer" className="h-3 w-2 bg-cyan-600" position={Position.Right} />
        </div>
      </div>
    );
  }
);
