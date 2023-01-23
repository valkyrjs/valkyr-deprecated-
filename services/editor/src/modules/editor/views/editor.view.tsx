import "reactflow/dist/style.css";

import ReactFlow, { Background, Controls, MiniMap } from "reactflow";

import { EditorController } from "./editor.controller";

export const EditorView = EditorController.view(
  ({ state: { nodeTypes, nodes, edges }, actions: { addNode, onNodesChange, onEdgesChange, onConnect } }) => {
    return (
      <div className="w-full h-full">
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
      </div>
    );
  }
);
