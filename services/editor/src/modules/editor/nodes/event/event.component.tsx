import { ArrowsOutCardinal, Plus } from "phosphor-react";
import { Handle, Position } from "reactflow";

import { Select } from "~components/select";
import { UnstyledButton } from "~components/unstyled-button";

import { EventNodeController } from "./event.controller";

export const EventNode = EventNodeController.view(
  ({ props: { data }, actions: { setType, addDataField, setDataField, removeDataField } }) => {
    return (
      <div className="relative">
        <div className="bg-gray-100 border rounded-sm text-xs border-gray-200 min-w-[320px]">
          <header className="flex gap-2 items-center justify-start border-b border-b-gray-200 py-1 px-2">
            <ArrowsOutCardinal size={16} color="#f2f2f2" />
            <input className="block-title" defaultValue={data.config.name} onBlur={setType} />
          </header>
          <section className="p-2">
            <form className="flex flex-col gap-1 font-mono text-xs">
              {data.config.data.map(([key], index) => (
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
        </div>
        <Handle className="bg-gray-200" type="source" position={Position.Right} />
      </div>
    );
  }
);
