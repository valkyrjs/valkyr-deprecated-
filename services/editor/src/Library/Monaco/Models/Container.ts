import * as monaco from "monaco-editor";

import { db } from "~Services/Database";
import { format } from "~Services/Prettier";

let model: monaco.editor.ITextModel | undefined;

/*
 |--------------------------------------------------------------------------------
 | Subscriber
 |--------------------------------------------------------------------------------
 */

db.collection("code").subscribe({ name: "container" }, { limit: 1 }, (document) => {
  if (document !== undefined) {
    setModel(document.value);
  }
});

/*
 |--------------------------------------------------------------------------------
 | Helpers
 |--------------------------------------------------------------------------------
 */

function setModel(value: string): void {
  if (model !== undefined) {
    return model.setValue(value);
  }
  model = monaco.editor.createModel(format(value), "typescript");
}
