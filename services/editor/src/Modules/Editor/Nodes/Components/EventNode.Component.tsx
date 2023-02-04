import { Handle, NodeProps, Position } from "reactflow";

import { EventBlock } from "~Blocks/Event/Event.Component";

export function EventNode({ data: { id } }: NodeProps) {
  return (
    <div className="relative">
      <EventBlock id={id} />
      <Handle
        type="source"
        className="h-3 w-2 bg-orange-600"
        style={{
          zIndex: 1,
          right: -7
        }}
        position={Position.Right}
      />
    </div>
  );
}
