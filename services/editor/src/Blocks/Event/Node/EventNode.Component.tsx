import { Handle, NodeProps, Position } from "reactflow";

import { EventBlock } from "../Event.Component";

export function EventNode({ data: { blockId } }: NodeProps) {
  return (
    <div className="relative">
      <EventBlock id={blockId} />
      <div className="absolute top-1/2 -right-2 flex h-9 -translate-y-1/2 flex-col justify-center gap-1">
        <Handle type="source" className="h-3 w-2 bg-orange-600" position={Position.Right} />
      </div>
    </div>
  );
}
