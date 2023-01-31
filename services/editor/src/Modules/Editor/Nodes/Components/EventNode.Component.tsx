import { Handle, NodeProps, Position } from "reactflow";

import { EventBlock } from "../../Library/Blocks/Event/Event.Component";

export function EventNode({ data: { id } }: NodeProps) {
  return (
    <div className="relative">
      <EventBlock id={id} />
      <Handle type="source" className="event-output-handle" position={Position.Right} />
    </div>
  );
}
