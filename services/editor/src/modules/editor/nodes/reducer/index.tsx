// import "./event.style.scss";

import { Handle, Position } from "reactflow";

import { NodeController } from "./controller";

export const ReducerNode = NodeController.view(({ state: { type }, actions: { setType } }) => {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="bg-indigo-400">
        <div>
          <label htmlFor="text" className="bg-white">
            Type:
          </label>
          <input className="bg-white p-2" id="text" name="text" defaultValue={type} onChange={setType} />
        </div>
        <div>
          <label htmlFor="text">Data:</label>
          <input id="text" name="text" onChange={() => {}} />
        </div>
        <div>
          <label htmlFor="text">Meta:</label>
          <input id="text" name="text" onChange={() => {}} />
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
});
