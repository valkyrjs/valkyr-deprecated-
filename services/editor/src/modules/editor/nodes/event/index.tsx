// import "./event.style.scss";

import { ArrowsOutCardinal, Plus } from "phosphor-react";
import { Handle, Position } from "reactflow";

import { Select } from "~components/select";
import { UnstyledButton } from "~components/unstyled-button";

import { NodeController } from "./controller";

export const EventNode = NodeController.view(({ state: { type }, actions: { setType } }) => {
  return (
    <div className="relative">
      <div className="bg-gray-100 border rounded-sm text-xs border-gray-200 min-w-[320px]">
        <header className="flex gap-2 items-center justify-start border-b border-b-gray-200 py-1 px-2">
          <ArrowsOutCardinal size={16} color="#f2f2f2" />
          EVENT
        </header>
        <section className="p-2">
          <form className="flex flex-col gap-1">
            <div className="flex flex-row gap-2">
              <div className="form-control">
                <input id="field.name" name="field.name" defaultValue={type} onChange={setType} />
              </div>
              <div className="form-control">
                <Select />
              </div>
            </div>
          </form>
          <div className="form-actions">
            <UnstyledButton className="w-full flex justify-start items-center text-xs">
              <Plus size={8} /> more
            </UnstyledButton>
          </div>
        </section>
      </div>
      <Handle className="bg-gray-200" type="source" position={Position.Right} />
    </div>
  );
});

{
  /* <div>
<label htmlFor="text">Type:</label>
<input id="text" name="text" defaultValue={type} onChange={setType} />
</div>
<div>
<label htmlFor="text">Data:</label>
<input id="text" name="text" onChange={() => {}} />
</div>
<div>
<label htmlFor="text">Meta:</label>
<input id="text" name="text" onChange={() => {}} />
</div> */
}
