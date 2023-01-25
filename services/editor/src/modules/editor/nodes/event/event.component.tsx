import { Disclosure } from "@headlessui/react";
import { Plus, XSquare } from "phosphor-react";
import { Handle, Position } from "reactflow";

import { BlockHeader } from "~components/block-header";
import { Editable } from "~components/editable";
import { Select } from "~components/select";
import { UnstyledButton } from "~components/unstyled-button";

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
              <Disclosure.Panel className="text-gray-500">
                <section className="p-2 flex flex-col gap-2">
                  <form className="flex flex-col gap-1">
                    {data.config.data.map(([key], index) => (
                      <div key={index} className="flex flex-row gap-2">
                        <UnstyledButton
                          className="text-darker-700 hover:text-darker-600"
                          onClick={removeDataField(index)}
                        >
                          <XSquare size={16} />
                        </UnstyledButton>
                        <div className="form-control">
                          <input
                            id={`data.${index}`}
                            name={`data.${index}`}
                            defaultValue={key}
                            onBlur={setDataField(index)}
                          />
                        </div>
                        <div className="form-control">
                          <Select />
                        </div>
                      </div>
                    ))}
                  </form>
                  <div className="form-actions">
                    <UnstyledButton
                      className="w-full text-darker-500 hover:text-light flex justify-start items-center text-xs"
                      onClick={addDataField}
                    >
                      <Plus size={8} /> more
                    </UnstyledButton>
                  </div>
                </section>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
        <Handle className="bg-gray-200" type="source" position={Position.Right} />
      </div>
    );
  }
);
