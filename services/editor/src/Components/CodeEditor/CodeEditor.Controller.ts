import { Controller } from "@valkyr/react";
import * as monaco from "monaco-editor";

export class CodeEditorController extends Controller<
  {
    id: string;
  },
  {
    defaultValue: string;
    onChange(value: string): void;
  }
> {
  #editor?: monaco.editor.IStandaloneCodeEditor;

  async onInit() {
    const id = crypto.randomUUID();
    this.#loadEditor(id);
    return {
      id
    };
  }

  async onDestroy(): Promise<void> {
    this.#editor?.dispose();
  }

  #loadEditor(id: string) {
    this.refs
      .on(`editor:${id}`)
      .then(async (element) => {
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
      })
      .catch((e) => console.log(e));
  }
}
