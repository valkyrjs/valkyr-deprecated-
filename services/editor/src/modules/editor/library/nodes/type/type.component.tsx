import { Disclosure } from "@headlessui/react";
import { NodeProps } from "reactflow";

import { BlockHeader } from "~components/block-header";
import { Editable } from "~components/editable";
import { TypeFields } from "~components/type-fields";

import { TypeNodeController } from "./type.controller";

export const TypeView = TypeNodeController.view(({ state: { node, data }, actions: { onRemove } }) => {
  return (
    <div className="relative">
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <div className="bg-darker border rounded-sm text-xs border-darker-800 min-w-[390px] font-mono">
            <BlockHeader
              open={open}
              onRemove={onRemove}
              color="green"
              symbol="T"
              content={
                <Editable value={node.data.name} onChange={data.name} name="name" placeholder="Add event name" />
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
    </div>
  );
});

export function TypeNode({ id }: NodeProps) {
  return <TypeView id={id} />;
}
