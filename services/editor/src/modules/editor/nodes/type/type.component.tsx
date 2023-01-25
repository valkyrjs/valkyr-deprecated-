import { ArrowsOutCardinal, Plus } from "phosphor-react";
import { Handle, Position } from "reactflow";

import { UnstyledButton } from "~components/unstyled-button";

import { TypeNodeController } from "./type.controller";

export const TypeNode = TypeNodeController.view(({ props: { data } }) => {
  return (
    <div className="relative">
      <div className="bg-gray-100 border rounded-sm text-xs border-gray-200 min-w-[320px]">
        <header className="flex gap-2 items-center justify-start border-b border-b-gray-200 py-1 px-2">
          <ArrowsOutCardinal size={16} color="#f2f2f2" />
          EVENT [{data.config.name}]
        </header>
        <section className="p-2">
          <form className="flex flex-col gap-1 font-mono text-xs">Magic Type Form</form>
          <div className="form-actions">
            <UnstyledButton className="w-full flex justify-start items-center text-xs">
              <Plus size={8} /> more
            </UnstyledButton>
          </div>
        </section>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
});
