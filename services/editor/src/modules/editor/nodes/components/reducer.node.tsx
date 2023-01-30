import { Handle, NodeProps, Position } from "reactflow";

import { ReducerBlock } from "../../library/blocks/reducer/reducer.component";

export function ReducerNode({ data: { id } }: NodeProps) {
  return (
    <div className="relative">
      <Handle type="target" position={Position.Left} />
      <ReducerBlock id={id} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
