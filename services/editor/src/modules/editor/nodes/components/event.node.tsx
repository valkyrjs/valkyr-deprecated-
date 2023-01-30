import { Handle, NodeProps, Position } from "reactflow";

import { EventBlock } from "../../library/blocks/event/event.component";

export function EventNode({ data: { id } }: NodeProps) {
  return (
    <div className="relative">
      <EventBlock id={id} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
