import "reactflow/dist/style.css";

import { Plus } from "phosphor-react";
import ReactFlow, { Background, Controls } from "reactflow";

import { Button } from "~components/button";
import { ModalPortal } from "~components/modal/view";

import { openLibraryModal } from "../library";
import { EditorController, nodeTypes } from "./editor.controller";

export const EditorView = EditorController.view(
  ({ state: { nodes, edges }, actions: { setInstance, onNodePositionChanged, onConnect } }) => {
    return (
      <>
        <div className="w-full h-screen">
          <div className="absolute left-4 top-4 z-50">
            <Button variant="primary" outline type="button" onClick={openLibraryModal}>
              <Plus size={10} color="#fff" />
              block
            </Button>
          </div>
          <ReactFlow
            id="blocks"
            onInit={setInstance}
            defaultNodes={nodes}
            defaultEdges={edges}
            nodeTypes={nodeTypes}
            onNodeDragStop={onNodePositionChanged}
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
