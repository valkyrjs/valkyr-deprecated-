import { Controller } from "@valkyr/react";
import * as monaco from "monaco-editor";

import { events } from "../configs/events";
import { generateEvents } from "../services/events";

// @ts-ignore
self.MonacoEnvironment = {
  getWorkerUrl: function (_moduleId: any, label: string) {
    if (label === "json") {
      return "./json.worker.bundle.js";
    }
    if (label === "css" || label === "scss" || label === "less") {
      return "./css.worker.bundle.js";
    }
    if (label === "html" || label === "handlebars" || label === "razor") {
      return "./html.worker.bundle.js";
    }
    if (label === "typescript" || label === "javascript") {
      return "./ts.worker.bundle.js";
    }
    return "./editor.worker.bundle.js";
  }
};

export class CodeEditorController extends Controller {
  async onInit() {
    this.refs.on("editor").then(async (element) => {
      const model = generateEvents(events);
      console.log(model);
      monaco.editor.createModel(model, "typescript");
      if (element !== undefined) {
        monaco.editor.create(element, {
          value: ["function validate(event: RealmCreated) {", "\tconsole.log(event);", "}"].join("\n"),
          language: "typescript"
        });
      }
    });
  }
}
