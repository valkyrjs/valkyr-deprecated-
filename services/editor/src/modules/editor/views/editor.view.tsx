import "reactflow/dist/style.css";

import { Plus } from "phosphor-react";
import ReactFlow, { Background, Controls } from "reactflow";

import { Button } from "~components/Button";
import { ModalPortal } from "~components/modal/view";

import { openLibraryModal } from "../library";
import { EditorController } from "./editor.controller";

export const EditorView = EditorController.view(
  ({ state: { nodeTypes, nodes, edges }, actions: { onNodesChange, onEdgesChange, onConnect } }) => {
    return (
      <>
        <div className="w-full h-screen">
          <div className="absolute left-4 top-4 z-50">
            <Button variant="primary" outline type="button" onClick={() => openLibraryModal()}>
              <Plus size={10} color="#fff" />
              block
            </Button>
          </div>
          <ReactFlow
            id="blocks"
            nodeTypes={nodeTypes}
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            proOptions={{ hideAttribution: true }}
          >
            <Controls />
            <Background />
          </ReactFlow>
        </div>
        <ModalPortal />
      </>
    );
  }
);
