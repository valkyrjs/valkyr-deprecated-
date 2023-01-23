import "./event.style.scss";

import { Handle, Position } from "reactflow";

import { EventNodeController } from "./event.controller";

export const EventNode = EventNodeController.view(({ state: { type }, actions: { setType } }) => {
  return (
    <>
      <Handle type="target" position={Position.Left} />
      <div className="valkyr__event-node">
        <div>
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
        </div>
      </div>
      <Handle type="source" position={Position.Right} />
    </>
  );
});
