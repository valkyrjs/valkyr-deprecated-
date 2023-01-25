import { ArrowsOutCardinal, Plus, XSquare } from "phosphor-react";
import { Handle, Position } from "reactflow";

import { Editable } from "~components/editable";
import { Select } from "~components/select";
import { UnstyledButton } from "~components/unstyled-button";

import { EventNodeController } from "./event.controller";

export const EventNode = EventNodeController.view(
  ({ props: { data }, actions: { setType, addDataField, setDataField, removeDataField } }) => {
    return (
      <div className="relative">
        <div className="bg-darker border rounded-sm text-xs border-darker-800 min-w-[320px] font-mono">
          <header className="flex gap-2 text-darker-700 items-center justify-start border-b border-b-darker-800 py-1 px-2">
            <ArrowsOutCardinal size={16} />
            <Editable value={data.config.name} onChange={setType} name="type" placeholder="Add event name" />
          </header>
          <section className="p-2 flex flex-col gap-2">
            <form className="flex flex-col gap-1">
              {data.config.data.map(([key], index) => (
                <div key={index} className="flex flex-row gap-2">
                  <UnstyledButton className="text-darker-700 hover:text-darker-600" onClick={removeDataField(index)}>
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
        </div>
        <Handle className="bg-gray-200" type="source" position={Position.Right} />
      </div>
    );
  }
);
