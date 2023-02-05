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
        <Handle
          type="target"
          id="event"
          className="h-3 w-2 bg-orange-600"
          style={{
            left: -7,
            top: 50
          }}
          position={Position.Left}
        />
        <Handle
          type="target"
          id="context"
          className="h-3 w-2 bg-pink-600"
          style={{
            left: -7,
            top: 70
          }}
          position={Position.Left}
        />
        <ValidatorBlock id={id} />
      </div>
    );
  }
);
