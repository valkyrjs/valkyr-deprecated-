import { Disclosure } from "@headlessui/react";
import { Handle, NodeProps, Position } from "reactflow";

import { BlockHeader } from "~components/block-header";
import { CodeEditor } from "~components/code-editor";

import { ReducerNodeController } from "./reducer.controller";

const ReducerView = ReducerNodeController.view(({ state: { node, model }, actions: { onChange, onRemove } }) => {
  return (
    <div className="relative">
      <Handle type="target" position={Position.Left} />
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <div className="bg-darker border-darker-800 min-w-[390px] rounded-sm border font-mono text-xs">
            <BlockHeader open={open} color="cyan" symbol="R" content="Reducer" onRemove={onRemove} />
            <Disclosure.Panel>
              <div
                className="border-b-darker-800 border-b"
                style={{
                  width: 640,
                  height: 400
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
});

export function ReducerNode({ id }: NodeProps) {
  return <ReducerView id={id} />;
}
