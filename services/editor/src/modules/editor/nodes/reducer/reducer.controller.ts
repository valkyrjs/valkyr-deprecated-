import { Controller } from "@valkyr/react";
import * as monaco from "monaco-editor";
import { Edge, Node } from "reactflow";

import { edges, nodes } from "~services/database";
import { format } from "~services/prettier";

import { EventNodeData, generateEventRecords, generateLedger } from "../event/event.node";
import { ReducerNodeData } from "./reducer.node";

export class ReducerNodeController extends Controller<{}, Node<ReducerNodeData>> {
  #editor?: monaco.editor.IStandaloneCodeEditor;
  #model?: monaco.editor.ITextModel;

  async onInit() {
    this.#loadEditor();
    this.#subscribeToEdges();
  }

  async onDestroy(): Promise<void> {
    this.#editor?.dispose();
    this.#model?.dispose();
  }

  #loadEditor() {
    this.refs.on("editor").then(async (element) => {
      if (element !== undefined) {
        this.#editor = monaco.editor.create(element, {
          theme: "dracula",
          language: "typescript",
          value: this.props.data.config.code,
          minimap: {
            enabled: false
          }
        });
      }
    });
  }

  #subscribeToEdges() {
    this.subscriptions.set(
      "edge:observer",
      edges.subscribe(
        {
          target: this.props.id
        },
        {},
        this.#subscribeToNodes
      )
    );
  }

  #subscribeToNodes = (edgeList: Edge[]) => {
    this.subscriptions.get("node:observer")?.unsubscribe();
    this.subscriptions.set(
      "node:observer",
      nodes.subscribe(
        {
          id: {
            $in: edgeList.map((edge) => edge.source)
          }
        },
        {},
        (eventNodes) => {
          const model = format(`
            ${generateLedger()}
            ${generateReducerEvents(eventNodes)}
            ${generateEventRecords(eventNodes.map((node) => node.data.config.name))}
            type State = {};
          `);
          if (this.#model !== undefined) {
            this.#model.setValue(model);
          } else {
            this.#model = monaco.editor.createModel(model, "typescript");
          }
          this.#editor?.setModel(this.#editor?.getModel());
        }
      )
    );
  };
}

function generateReducerEvents(eventNodes: Node<EventNodeData>[]): string {
  return eventNodes.map((node) => node.data.monaco.model).join("\n");
}
