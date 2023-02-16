import * as monaco from "monaco-editor";

import { format } from "~Services/Prettier";

monaco.editor.createModel(
  format(`
    interface Reducers {}

    class api {
      /**
       * Event validator used to confirm the validity of new events before they are
       * committed to the event store.
       */
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
