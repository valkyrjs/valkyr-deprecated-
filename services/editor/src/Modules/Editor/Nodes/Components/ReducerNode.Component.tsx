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
        <Handle
          type="target"
          id="events"
          className="event-output-handle h-6 bg-orange-600/75 hover:bg-orange-600"
          position={Position.Left}
        />
        <ReducerBlock id={id} />
        <Handle
          type="target"
          id="state"
          className="state-output-handle h-6 bg-pink-600/75 hover:bg-pink-600"
          position={Position.Right}
        />
      </div>
    );
  }
);
