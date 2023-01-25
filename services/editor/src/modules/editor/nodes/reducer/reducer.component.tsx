import { Disclosure } from "@headlessui/react";
import { Plus } from "phosphor-react";
import { Handle, Position } from "reactflow";

import { BlockHeader } from "~components/block-header";
import { Select } from "~components/select";
import { UnstyledButton } from "~components/unstyled-button";

import { ReducerNodeController } from "./reducer.controller";

export const ReducerNode = ReducerNodeController.view(
  ({ props: { data }, actions: { addDataField, setDataField, removeDataField }, refs }) => {
    return (
      <div className="relative">
        <Handle type="target" position={Position.Left} />
        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <div className="bg-darker border rounded-sm text-xs border-darker-800 min-w-[390px] font-mono">
              <BlockHeader open={open} color="blue" symbol="R" content="Reducer" />
              <Disclosure.Panel className="text-gray-500">
                <div
                  className="border rounded-sm text-xs border-gray-200"
                  style={{
                    width: 800,
                    height: 600
                  }}
                >
                  <div className="h-full w-full" ref={refs.set("editor")}></div>
                </div>
                <header className="bg-gray-100 flex gap-2 items-center justify-start border-b border-b-gray-200 py-1 px-2">
                  State
                </header>
                <section className="bg-gray-100 p-2">
                  <form className="flex flex-col gap-1 font-mono text-xs">
                    {data.config.state.map(([key], index) => (
                      <div key={index} className="flex flex-row gap-2">
                        <UnstyledButton onClick={removeDataField(index)}>X</UnstyledButton>
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
                    <UnstyledButton className="w-full flex justify-start items-center text-xs" onClick={addDataField}>
                      <Plus size={8} /> more
                    </UnstyledButton>
                  </div>
                </section>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
        <Handle type="source" position={Position.Right} />
      </div>
    );
  }
);
