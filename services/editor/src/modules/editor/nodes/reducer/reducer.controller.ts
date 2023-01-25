import { Controller } from "@valkyr/react";
import * as monaco from "monaco-editor";
import { Edge, Node } from "reactflow";

import { edges, nodes } from "~services/database";
import { format } from "~services/prettier";

import { EventNodeData, generateEventRecords, generateLedger } from "../event/event.node";
import { getStateType, ReducerNodeData } from "./reducer.node";

export class ReducerNodeController extends Controller<{}, Node<ReducerNodeData>> {
  #editor?: monaco.editor.IStandaloneCodeEditor;
  #model?: monaco.editor.ITextModel;

  #inputNodes: Node[] = [];

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
        this.#subscribeToInputNodes
      )
    );
  }

  #subscribeToInputNodes = (edgeList: Edge[]) => {
    this.subscriptions.get("node:observer")?.unsubscribe();
    this.subscriptions.set(
      "input:observer",
      nodes.subscribe(
        {
          id: {
            $in: edgeList.map((edge) => edge.source)
          }
        },
        {},
        (eventNodes) => {
          this.#inputNodes = eventNodes;
          this.#reloadEditorModels();
        }
      )
    );
  };

  addDataField() {
    nodes.updateOne(
      {
        id: this.props.id
      },
      {
        $push: {
          "data.config.state": ["", "p:string"]
        }
      }
    );
  }

  setDataField(index: number) {
    return (e: any) => {
      nodes
        .updateOne(
          { id: this.props.id },
          {
            $set: { [`data.config.state[${index}]`]: [e.target.value, "p:string"] }
          }
        )
        .then(this.#generateMonacoModel);
    };
  }

  removeDataField(index: number) {
    return () => {
      nodes
        .updateOne(
          {
            id: this.props.id
          },
          {
            $set: {
              "data.config.state": (data: any[]) =>
                data.reduce((list, _, i) => {
                  if (i !== index) {
                    list.push(data[i]);
                  }
                  return list;
                }, [])
            }
          }
        )
        .then(this.#generateMonacoModel);
    };
  }

  #reloadEditorModels = () => {
    const model = format(`
      ${generateLedger()}
      ${generateReducerEvents(this.#inputNodes)}
      ${generateEventRecords(this.#inputNodes.map((node) => node.data.config.name))}
      ${this.props.data.monaco.model}
    `);
    if (this.#model !== undefined) {
      this.#model.setValue(model);
    } else {
      this.#model = monaco.editor.createModel(model, "typescript");
    }
    this.#editor?.setModel(this.#editor?.getModel());
  };

  #generateMonacoModel = async (): Promise<void> => {
    const node = await nodes.findById(this.props.id);
    if (node !== undefined) {
      nodes.updateOne(
        { id: node.id },
        {
          $set: {
            "data.monaco.model": getStateType(node.data.config.state)
          }
        }
      );
    }
  };
}

function generateReducerEvents(eventNodes: Node<EventNodeData>[]): string {
  return eventNodes.map((node) => node.data.monaco.model).join("\n");
}
