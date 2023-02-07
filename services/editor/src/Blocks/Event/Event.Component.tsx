import { Disclosure } from "@headlessui/react";

import { BlockHeader } from "~Components/BlockHeader";
import { Editable } from "~Components/Editable";
import { TypeFields } from "~Components/TypeFields";

import { EventBlockController } from "./Event.Controller";

export const EventBlock = EventBlockController.view(
  ({ state: { block, data, meta }, actions: { setName, onCopy, onRemove } }) => {
    if (block === undefined) {
      return <div>404 Block Not Found</div>;
    }
    return (
      <div className="relative">
        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <div className="bg-darker border-darker-800 min-w-[390px] rounded-sm border font-mono text-xs">
              <BlockHeader
                open={open}
                onCopy={onCopy}
                onRemove={onRemove}
                color="orange"
                symbol="E"
                content={<Editable value={block.name} onChange={setName} name="name" placeholder="Add event name" />}
              />
              <Disclosure.Panel>
                <div className="text-darker-400 border-b-darker-800 flex w-full items-center justify-between gap-2 border-b py-1 px-2">
                  Data
                </div>
                <TypeFields
                  data={block.data}
                  addField={data.addField}
                  setFieldKey={data.setFieldKey}
                  setFieldValue={data.setFieldValue}
                  removeField={data.removeField}
                />
                <div className="text-darker-400 border-b-darker-800 border-t-darker-800 flex w-full items-center justify-between gap-2 border-b border-t py-1 px-2">
                  Meta
                </div>
                <TypeFields
                  data={block.meta}
                  addField={meta.addField}
                  setFieldKey={meta.setFieldKey}
                  setFieldValue={meta.setFieldValue}
                  removeField={meta.removeField}
                />
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
      </div>
    );
  }
);
