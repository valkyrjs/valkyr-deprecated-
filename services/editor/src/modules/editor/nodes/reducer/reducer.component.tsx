import { ArrowsOutCardinal } from "phosphor-react";
import { Handle, Position } from "reactflow";

import { ReducerNodeController } from "./reducer.controller";

export const ReducerNode = ReducerNodeController.view(({ refs }) => {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <header className="bg-gray-100 flex gap-2 items-center justify-start border-b border-b-gray-200 py-1 px-2">
        <ArrowsOutCardinal size={16} color="#f2f2f2" />
        Reducer
      </header>
      <div
        className="border rounded-sm text-xs border-gray-200"
        style={{
          width: 800,
          height: 600
        }}
      >
        <div className="h-full w-full" ref={refs.set("editor")}></div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
});
