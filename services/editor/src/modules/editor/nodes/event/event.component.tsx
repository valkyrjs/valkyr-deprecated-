import { Disclosure } from "@headlessui/react";
import { Handle, Position } from "reactflow";

import { BlockHeader } from "~components/block-header";
import { Editable } from "~components/editable";
import { TypeFields } from "~components/type-fields";

import { EventNodeController } from "./event.controller";

export const EventNode = EventNodeController.view(
  ({ props: { data }, actions: { setType, addDataField, setDataField, removeDataField } }) => {
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
                  <Editable value={data.config.name} onChange={setType} name="type" placeholder="Add event name" />
                }
              />
              <Disclosure.Panel>
                <TypeFields
                  data={data.config.data}
                  addField={addDataField}
                  setFieldKey={setDataField}
                  removeField={removeDataField}
                />
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
        <Handle type="source" position={Position.Right} />
      </div>
    );
  }
);
