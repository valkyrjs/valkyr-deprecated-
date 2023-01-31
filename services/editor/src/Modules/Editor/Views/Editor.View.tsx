import "reactflow/dist/style.css";

import { CaretDoubleLeft, Plus } from "phosphor-react";
import ReactFlow, { Background, Controls, Panel } from "reactflow";

import { Button } from "~Components/Button";
import { ModalPortal } from "~Components/Modal";

import { openLibraryModal } from "../Library";
import { nodeTypes } from "../Nodes";
import { SettingsView } from "../Settings/settings.view";
import { EditorController } from "./Editor.Controller";

export const EditorView = EditorController.view(
  ({
    state: { nodes, edges, asideOpen },
    actions: { toggleAside, onNodesChange, onNodePositionChanged, onConnect }
  }) => {
    return (
      <>
        <div className="text-light bg-back h-screen w-full">
          <ReactFlow
            id="blocks"
            nodes={nodes}
            edges={edges}
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
          <SettingsView isOpen={asideOpen} setClosed={() => toggleAside(false)} />
        </div>
        <ModalPortal />
      </>
    );
  }
);
