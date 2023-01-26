import { Disclosure } from "@headlessui/react";
import { Handle, Node, Position } from "reactflow";

import { BlockHeader } from "~components/block-header";
import { Editable } from "~components/editable";
import { TypeFields } from "~components/type-fields";

import { EventNodeController } from "./event.controller";

export const EventView = EventNodeController.view(({ state: { node, data, meta } }) => {
  return (
    <div className="relative">
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <div className="bg-darker border rounded-sm text-xs border-darker-800 min-w-[390px] font-mono">
            <BlockHeader
              open={open}
              color="orange"
              symbol="E"
              content={
                <Editable value={node.data.name} onChange={data.name} name="name" placeholder="Add event name" />
              }
            />
            <Disclosure.Panel>
              <div className="flex w-full gap-2 text-darker-700 items-center justify-between py-1 px-2 border-b border-b-darker-800">
                Data
              </div>
              <TypeFields
                data={node.data.data}
                addField={data.add}
                setFieldKey={data.setKey}
                setFieldValue={data.setValue}
                removeField={data.del}
              />
              <div className="flex w-full gap-2 text-darker-700 items-center justify-between py-1 px-2 border-b border-b-darker-800 border-t border-t-darker-800">
                Meta
              </div>
              <TypeFields
                data={node.data.meta}
                addField={meta.add}
                setFieldKey={meta.setKey}
                setFieldValue={data.setValue}
                removeField={meta.del}
              />
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>
      <Handle type="source" position={Position.Right} />
    </div>
  );
});

export function EventNode({ id }: Node) {
  return <EventView id={id} />;
}
