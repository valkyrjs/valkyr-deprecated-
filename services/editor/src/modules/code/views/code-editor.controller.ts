import { Controller } from "@valkyr/react";
import * as monaco from "monaco-editor";

import { events } from "../configs/events";
import { generateEvents } from "../services/events";

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
