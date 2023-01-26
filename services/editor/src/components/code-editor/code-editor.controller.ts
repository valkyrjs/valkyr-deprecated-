import { Controller } from "@valkyr/react";
import * as monaco from "monaco-editor";

export class CodeEditorController extends Controller<
  {
    id: string;
  },
  {
    defaultValue: string;
    model?: string;
    onChange(value: string): void;
  }
> {
  #editor?: monaco.editor.IStandaloneCodeEditor;
  #model?: monaco.editor.ITextModel;

  async onInit() {
    const id = crypto.randomUUID();
    this.#loadEditor(id);
    return {
      id
    };
  }

  async onResolve() {
    this.#loadModel(this.props.model);
  }

  async onDestroy(): Promise<void> {
    this.#editor?.dispose();
    this.#model?.dispose();
  }

  #loadEditor(id: string) {
    this.refs.on(`editor:${id}`).then(async (element) => {
      if (element !== undefined) {
        this.#editor = monaco.editor.create(element, {
          theme: "dracula",
          language: "typescript",
          value: this.props.defaultValue,
          minimap: {
            enabled: false
          }
        });
        let timeout: any;
        this.#editor.onDidChangeModelContent(() => {
          clearTimeout(timeout);
          timeout = setTimeout(() => {
            this.props.onChange(this.#editor?.getValue() ?? "");
          }, 500);
        });
      }
    });
  }

  #loadModel(value?: string) {
    if (value === undefined && this.#model !== undefined) {
      this.#model.dispose();
    }
    if (value !== undefined && this.#model === undefined) {
      this.#model = monaco.editor.createModel(value, "typescript");
    }
    if (value !== undefined && this.#model !== undefined) {
      this.#model.setValue(value);
    }
  }
}
