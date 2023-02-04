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
        <Handle
          type="target"
          id="events"
          className="h-3 w-2 bg-orange-600"
          style={{
            zIndex: 1,
            left: -7
          }}
          position={Position.Left}
        />
        <ReducerBlock id={id} />
        <Handle
          type="source"
          id="reducer"
          className="h-3 w-2 bg-cyan-600"
          style={{
            zIndex: 1,
            right: -7
          }}
          position={Position.Right}
        />
      </div>
    );
  }
);
