import * as monaco from "monaco-editor";

import { format } from "~Services/Prettier";

// let cachedTypes: string[] = [];

export class ModelManager {
  #models: monaco.editor.ITextModel[] = [];

  add(value: string) {
    this.#models.push(monaco.editor.createModel(format(value), "typescript"));
  }

  flush() {
    for (const model of this.#models) {
      model.dispose();
    }
    this.#models = [];
  }
}

/*
 |--------------------------------------------------------------------------------
 | Monaco
 |--------------------------------------------------------------------------------
 *

db.collection<TypeBlock>("blocks").subscribe({ type: "type" }, {}, (types) => {
  cachedTypes = [];
  for (const type of types) {
    cachedTypes = getTypeNames(type.value);
  }
});

export function getTypes(): string[] {
  return cachedTypes;
}

function getTypeNames(value: string): string[] {
  return Array.from(value.matchAll(/type (.*) =/gi)).map((match) => `${match[1]}`);
}
*/
