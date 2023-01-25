import "reactflow/dist/style.css";

import { CaretDoubleLeft, Plus } from "phosphor-react";
import ReactFlow, { Background, Controls } from "reactflow";

import { Button } from "~components/button";
import { ModalPortal } from "~components/modal/view";

import { openLibraryModal } from "../library";
import { Settings } from "../settings/settings.view";
import { EditorController, nodeTypes } from "./editor.controller";

export const EditorView = EditorController.view(
  ({ state: { nodes, edges, asideOpen }, actions: { toggleAside, setInstance, onNodePositionChanged, onConnect } }) => {
    return (
      <>
        <div className="w-full h-screen text-light bg-back">
          <div className="absolute left-4 top-4 z-50">
            <Button variant="primary" outline type="button" onClick={openLibraryModal}>
              <Plus size={10} />
              block
            </Button>
          </div>
          <div className="absolute right-4 top-4 z-10">
            <Button variant="primary" outline type="button" onClick={() => toggleAside(true)}>
              <CaretDoubleLeft size={16} />
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
            <Controls showInteractive={false} />
            <Background />
          </ReactFlow>
          <Settings isOpen={asideOpen} setClosed={() => toggleAside(false)} />
        </div>
        <ModalPortal />
      </>
    );
  }
);
