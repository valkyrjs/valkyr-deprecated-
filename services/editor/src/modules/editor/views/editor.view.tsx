import "reactflow/dist/style.css";

import { CaretDoubleLeft, Plus } from "phosphor-react";
import ReactFlow, { Background, Controls, Panel } from "reactflow";

import { Button } from "~components/button";
import { ModalPortal } from "~components/modal/view";

import { openLibraryModal } from "../library";
import { nodeTypes } from "../library/nodes";
import { Settings } from "../settings/settings.view";
import { EditorController } from "./editor.controller";

export const EditorView = EditorController.view(
  ({
    state: { nodes, edges, asideOpen },
    actions: { toggleAside, setInstance, onNodesChange, onNodePositionChanged, onConnect }
  }) => {
    return (
      <>
        <div className="w-full h-screen text-light bg-back">
          <ReactFlow
            id="blocks"
            onInit={setInstance}
            defaultNodes={nodes}
            defaultEdges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={onNodesChange}
            onNodeDragStop={onNodePositionChanged}
            onConnect={onConnect}
            proOptions={{ hideAttribution: true }}
          >
            <Panel position="top-left">
              <Button variant="primary" outline type="button" onClick={openLibraryModal}>
                <Plus size={10} />
                block
              </Button>
            </Panel>
            <Panel position="top-right">
              <Button variant="primary" outline type="button" onClick={() => toggleAside(true)}>
                <CaretDoubleLeft size={16} />
              </Button>
            </Panel>
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
