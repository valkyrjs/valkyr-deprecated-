import "./dashboard.style.scss";

import ReactFlow, { Background, Controls, MiniMap } from "reactflow";

import { DashboardController } from "./dashboard.controller";

export const DashboardView = DashboardController.view(
  ({ state: { nodeTypes, nodes, edges }, actions: { addNode, onNodesChange, onEdgesChange, onConnect } }) => {
    return (
      <ReactFlow
        nodeTypes={nodeTypes}
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
      >
        <div className="react-flow__panel react-flow__minimap top right">
          <button
            className="react-flow__controls-button"
            type="button"
            onClick={() => addNode({ type: "event", position: { x: 0, y: 0 }, data: {} })}
          >
            Add Node
          </button>
        </div>

        <MiniMap />
        <Controls />
        <Background />
      </ReactFlow>
    );
  }
);
