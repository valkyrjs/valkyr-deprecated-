import "reactflow/dist/style.css";

import { CaretDoubleLeft, Plus } from "phosphor-react";
import ReactFlow, { Background, Controls, MiniMap, Panel } from "reactflow";

import { Button } from "~Components/Button";
import { ModalPortal } from "~Components/Modal";

import { openCommandPalette } from "../CommandPalette";
import { edgeTypes } from "../Edges";
import { openLibraryModal } from "../Library";
import { nodeTypes } from "../Nodes";
import { Settings } from "../Settings/Settings.Component";
import { EditorController } from "./Editor.Controller";

export const EditorView = EditorController.view(
  ({
    state: { viewport, nodes, edges, asideOpen },
    actions: { toggleAside, onNodesChange, onNodePositionChanged, onViewportChanged, onConnect }
  }) => {
    return (
      <>
        <div className="text-light bg-back h-screen w-full">
          <ReactFlow
            id="blocks"
            defaultViewport={viewport}
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onNodeDragStop={onNodePositionChanged}
            onMoveEnd={onViewportChanged}
            onConnect={onConnect}
            proOptions={{ hideAttribution: true }}
          >
            <MiniMap
              position="bottom-right"
              zoomable
              pannable
              nodeColor="#282a36"
              nodeStrokeColor="#373a4d"
              nodeStrokeWidth={2}
              maskColor="#ff79c610"
              className="border-pink rounded border bg-[#414652]"
            />
            <Panel position="top-left">
              <Button variant="primary" outline type="button" onClick={openLibraryModal}>
                <Plus size={10} />
                block
              </Button>
              <Button variant="primary" outline type="button" onClick={openCommandPalette}>
                <Plus size={10} />
                commands
              </Button>
            </Panel>
            <Panel position="top-right">
              <Button variant="primary" outline type="button" onClick={() => toggleAside(true)}>
                <CaretDoubleLeft size={16} />
              </Button>
            </Panel>
            <Controls showInteractive={false}></Controls>
            <Background />
          </ReactFlow>
          <Settings isOpen={asideOpen} setClosed={() => toggleAside(false)} />
        </div>
        <ModalPortal />
      </>
    );
  }
);
