import { Disclosure } from "@headlessui/react";
import { Handle, Position } from "reactflow";

import { BlockHeader } from "~components/block-header";
import { TypeFields } from "~components/type-fields";

import { ReducerNodeController } from "./reducer.controller";

export const ReducerNode = ReducerNodeController.view(
  ({ props: { data }, actions: { addDataField, setDataField, removeDataField }, refs }) => {
    return (
      <div className="relative">
        <Handle type="target" position={Position.Left} />
        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <div className="bg-darker border rounded-sm text-xs border-darker-800 min-w-[390px] font-mono">
              <BlockHeader open={open} color="cyan" symbol="R" content="Reducer" />
              <Disclosure.Panel>
                <div
                  className="border-b border-b-darker-800"
                  style={{
                    width: 800,
                    height: 600
                  }}
                >
                  <div className="h-full w-full" ref={refs.set("editor")}></div>
                </div>
                <header
                  className={`flex w-full gap-2 text-darker-700 items-center justify-between ${
                    open && "border-b border-b-darker-800"
                  } py-1 px-2`}
                >
                  State
                </header>
                <TypeFields
                  data={data.config.state}
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
