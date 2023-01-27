import { Disclosure } from "@headlessui/react";
import { Handle, NodeProps, Position } from "reactflow";

import { BlockHeader } from "~components/block-header";
import { Editable } from "~components/editable";
import { TypeFields } from "~components/type-fields";

import { StateNodeController } from "./state.controller";

export const StateView = StateNodeController.view(({ state: { node, data }, actions: { onRemove } }) => {
  return (
    <div className="relative">
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <div className="bg-darker border rounded-sm text-xs border-darker-800 min-w-[390px] font-mono">
            <BlockHeader
              open={open}
              onRemove={onRemove}
              color="magenta"
              symbol="S"
              content={
                <Editable value={node.data.name} onChange={data.name} name="name" placeholder="Add state name" />
              }
            />
            <Disclosure.Panel>
              <TypeFields
                data={node.data.data}
                addField={data.add}
                setFieldKey={data.setKey}
                setFieldValue={data.setValue}
                removeField={data.del}
              />
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>
      <Handle className="bg-gray-200" type="source" position={Position.Right} />
    </div>
  );
});

export function StateNode({ id }: NodeProps) {
  return <StateView id={id} />;
}
