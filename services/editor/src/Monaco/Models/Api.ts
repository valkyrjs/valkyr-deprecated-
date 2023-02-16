import * as monaco from "monaco-editor";

import { db } from "~Services/Database";
import { format } from "~Services/Prettier";

let model: monaco.editor.ITextModel | undefined;

/*
 |--------------------------------------------------------------------------------
 | Global Interfaces
 |--------------------------------------------------------------------------------
 */

monaco.editor.createModel("interface Reducers {};", "typescript");

/*
 |--------------------------------------------------------------------------------
 | Subscriber
 |--------------------------------------------------------------------------------
 */

db.collection("code").subscribe({ name: "api" }, { limit: 1 }, (document) => {
  if (document !== undefined) {
    setApiModel(document.value);
  }
});

/*
 |--------------------------------------------------------------------------------
 | Helpers
 |--------------------------------------------------------------------------------
 */

function setApiModel(value: string): void {
  if (model !== undefined) {
    return model.setValue(value);
  }
  model = monaco.editor.createModel(format(value), "typescript");
}

/*
const model = monaco.editor.createModel(
  format(`
    interface Reducers {}

    class api {
      /**
       * Event validator used to confirm the validity of new events before they are
       * committed to the event store.
       *
      static readonly validator = new Validator<EventRecord>();

      static reducer<Name extends keyof Reducers>(
        name: Name, 
        reducer: (
          state: Reducers[Name]["State"],
          event: Reducers[Name]["Event"]
        ) => Reducers[Name]["State"]
      ): void {}
    }
  `),
  "typescript"
);
*/
