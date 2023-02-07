import { Handle, NodeProps, Position } from "reactflow";

import { StateBlock } from "../State.Component";

export function StateNode({ data: { blockId } }: NodeProps) {
  return (
    <div className="relative">
      <div className="absolute top-1/2 -left-2 flex h-9 -translate-y-1/2 flex-col justify-center gap-1">
        <Handle type="target" id="state" className="h-3 w-2 bg-cyan-600" position={Position.Left} />
      </div>
      <StateBlock id={blockId} />
      <div className="absolute top-1/2 -right-2 flex h-9 -translate-y-1/2 flex-col justify-center gap-1">
        <Handle type="source" id="state" className="h-3 w-2 bg-pink-600" position={Position.Right} />
      </div>
    </div>
  );
}
