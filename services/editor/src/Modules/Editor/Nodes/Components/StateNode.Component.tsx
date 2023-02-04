import { Handle, NodeProps, Position } from "reactflow";

import { StateBlock } from "~Blocks/State/State.Component";

export function StateNode({ data: { id } }: NodeProps) {
  return (
    <div className="relative">
      <Handle
        type="target"
        id="state"
        className="h-3 w-2 bg-cyan-600"
        style={{
          zIndex: 1,
          left: -7
        }}
        position={Position.Left}
      />
      <StateBlock id={id} />
      <Handle
        type="source"
        id="state"
        className="h-3 w-2 bg-pink-600"
        style={{
          zIndex: 1,
          right: -7
        }}
        position={Position.Right}
      />
    </div>
  );
}
