import { Disclosure } from "@headlessui/react";
import { Handle, Node, Position } from "reactflow";

import { BlockHeader } from "~components/block-header";
import { Editable } from "~components/editable";
import { TypeFields } from "~components/type-fields";

import { StateNodeController } from "./state.controller";

export const StateView = StateNodeController.view(
  ({ state: { node }, actions: { setName, addDataField, setDataField, removeDataField } }) => {
    return (
      <div className="relative">
        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <div className="bg-darker border rounded-sm text-xs border-darker-800 min-w-[390px] font-mono">
              <BlockHeader
                open={open}
                color="magenta"
                symbol="S"
                content={
                  <Editable value={node.data.config.name} onChange={setName} name="name" placeholder="Add state name" />
                }
              />
              <Disclosure.Panel className="text-gray-500">
                <TypeFields
                  data={node.data.config.data}
                  addField={addDataField}
                  setFieldKey={setDataField}
                  removeField={removeDataField}
                />
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
        <Handle className="bg-gray-200" type="source" position={Position.Right} />
      </div>
    );
  }
);

export function StateNode({ id }: Node) {
  return <StateView id={id} />;
}
