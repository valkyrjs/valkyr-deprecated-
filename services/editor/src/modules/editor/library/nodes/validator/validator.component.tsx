import { Disclosure } from "@headlessui/react";
import { Handle, NodeProps, Position } from "reactflow";

import { BlockHeader } from "~components/block-header";
import { CodeEditor } from "~components/code-editor";

import { ValidatorNodeController } from "./validator.controller";

const ValidatorView = ValidatorNodeController.view(
  ({ state: { node, event, state, model }, actions: { onChange, onRemove } }) => {
    return (
      <div className="relative">
        <Handle type="target" position={Position.Left} />
        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <div className="bg-darker border rounded-sm text-xs border-darker-800 min-w-[390px] font-mono">
              <BlockHeader
                open={open}
                color="cyan"
                symbol="V"
                content={`Validate ${event?.data.name ?? "Event"} w/${state?.data.name ?? "State"}`}
                onRemove={onRemove}
              />
              <Disclosure.Panel>
                <div
                  className="border-b border-b-darker-800"
                  style={{
                    width: 800,
                    height: 600
                  }}
                >
                  <CodeEditor defaultValue={node.data.value} model={model} onChange={onChange} />
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
        <Handle type="source" position={Position.Right} />
      </div>
    );
  }
);

export function ValidatorNode({ id }: NodeProps) {
  return <ValidatorView id={id} />;
}
