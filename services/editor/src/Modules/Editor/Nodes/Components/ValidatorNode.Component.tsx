import { Handle, Position } from "reactflow";

import { ValidatorBlock } from "~Blocks/Validator/Validator.Component";

import { ValidatorNodeController } from "./ValidatorNode.Controller";

export const ValidatorNode = ValidatorNodeController.view(
  ({
    props: {
      data: { id }
    }
  }) => {
    return (
      <div className="relative">
        <div className="absolute top-1/2 -left-2 flex h-9 -translate-y-1/2 flex-col justify-center gap-1">
          <Handle type="target" id="event" className="h-3 w-2 bg-orange-600" position={Position.Left} />
          <Handle type="target" id="context" className="h-3 w-2 bg-pink-600" position={Position.Left} />
        </div>
        <ValidatorBlock id={id} />
      </div>
    );
  }
);
