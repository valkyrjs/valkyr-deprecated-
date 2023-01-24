import { Handle, Position } from "reactflow";

import { ReducerNodeController } from "./reducer.controller";

export const ReducerNode = ReducerNodeController.view(({ refs }) => {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div
        className="bg-indigo-400 p-2 border rounded-sm text-xs border-gray-200"
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
