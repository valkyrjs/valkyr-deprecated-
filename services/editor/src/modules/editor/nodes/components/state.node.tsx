import { Handle, NodeProps, Position } from "reactflow";

import { StateBlock } from "../../library/blocks/state/state.component";

export function StateNode({ data: { id } }: NodeProps) {
  return (
    <div className="relative">
      <StateBlock id={id} />
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
