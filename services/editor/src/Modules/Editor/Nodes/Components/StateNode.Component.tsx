import { Handle, NodeProps, Position } from "reactflow";

import { StateBlock } from "~Blocks/State/State.Component";

export function StateNode({ data: { id } }: NodeProps) {
  return (
    <div className="relative">
      <Handle
        type="source"
        id="reducer"
        className="state-output-handle bg-pink-600/75 hover:bg-pink-600"
        position={Position.Left}
      />
      <StateBlock id={id} />
      <Handle
        type="source"
        id="validator"
        className="state-output-handle bg-pink-600/75 hover:bg-pink-600"
        position={Position.Right}
      />
    </div>
  );
}
