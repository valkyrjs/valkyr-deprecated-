import * as monaco from "monaco-editor";

import { db } from "~services/database";
import { format } from "~services/prettier";

import { getLedgerModel } from "./ledger";

const packages = ["mongodb"];

// validation settings
monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
  noSemanticValidation: true,
  noSyntaxValidation: false
});

// compiler options
monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
  target: monaco.languages.typescript.ScriptTarget.ES2020,
  allowNonTsExtensions: true
});

for (const pkg of packages) {
  fetch(`http://localhost:3000/${pkg}.d.ts`, { method: "GET" })
    .then((res) => res.text())
    .then((value) => {
      const libUri = `ts:${pkg}.d.ts`;
      monaco.languages.typescript.javascriptDefaults.addExtraLib(value, libUri);
      monaco.editor.createModel(value, "typescript", monaco.Uri.parse(libUri));
    });
}

/*
 |--------------------------------------------------------------------------------
 | Workers
 |--------------------------------------------------------------------------------
 */

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

/*
 |--------------------------------------------------------------------------------
 | Global Models
 |--------------------------------------------------------------------------------
 */

monaco.editor.createModel(getLedgerModel(), "typescript");

const typeModel = monaco.editor.createModel("", "typescript");

db.collection("nodes").subscribe({ type: "type" }, {}, (nodes) => {
  typeModel.setValue(
    format(`
        ${nodes.map((node) => node.data.cache).join("\n")}
      `)
  );
});

/*
 |--------------------------------------------------------------------------------
 | Theme
 |--------------------------------------------------------------------------------
 */

monaco.editor.defineTheme("dracula", {
  base: "vs-dark",
  inherit: true,
  rules: [
    {
      background: "282a36",
      token: ""
    },
    {
      foreground: "6272a4",
      token: "comment"
    },
    {
      foreground: "f1fa8c",
      token: "string"
    },
    {
      foreground: "bd93f9",
      token: "constant.numeric"
    },
    {
      foreground: "bd93f9",
      token: "constant.language"
    },
    {
      foreground: "bd93f9",
      token: "constant.character"
    },
    {
      foreground: "bd93f9",
      token: "constant.other"
    },
    {
      foreground: "ffb86c",
      token: "variable.other.readwrite.instance"
    },
    {
      foreground: "ff79c6",
      token: "constant.character.escaped"
    },
    {
      foreground: "ff79c6",
      token: "constant.character.escape"
    },
    {
      foreground: "ff79c6",
      token: "string source"
    },
    {
      foreground: "ff79c6",
      token: "string source.ruby"
    },
    {
      foreground: "ff79c6",
      token: "keyword"
    },
    {
      foreground: "ff79c6",
      token: "storage"
    },
    {
      foreground: "8be9fd",
      fontStyle: "italic",
      token: "storage.type"
    },
    {
      foreground: "50fa7b",
      fontStyle: "underline",
      token: "entity.name.class"
    },
    {
      foreground: "50fa7b",
      fontStyle: "italic underline",
      token: "entity.other.inherited-class"
    },
    {
      foreground: "50fa7b",
      token: "entity.name.function"
    },
    {
      foreground: "ffb86c",
      fontStyle: "italic",
      token: "variable.parameter"
    },
    {
      foreground: "ff79c6",
      token: "entity.name.tag"
    },
    {
      foreground: "50fa7b",
      token: "entity.other.attribute-name"
    },
    {
      foreground: "8be9fd",
      token: "support.function"
    },
    {
      foreground: "6be5fd",
      token: "support.constant"
    },
    {
      foreground: "66d9ef",
      fontStyle: " italic",
      token: "support.type"
    },
    {
      foreground: "66d9ef",
      fontStyle: " italic",
      token: "support.class"
    },
    {
      foreground: "f8f8f0",
      background: "ff79c6",
      token: "invalid"
    },
    {
      foreground: "f8f8f0",
      background: "bd93f9",
      token: "invalid.deprecated"
    },
    {
      foreground: "cfcfc2",
      token: "meta.structure.dictionary.json string.quoted.double.json"
    },
    {
      foreground: "6272a4",
      token: "meta.diff"
    },
    {
      foreground: "6272a4",
      token: "meta.diff.header"
    },
    {
      foreground: "ff79c6",
      token: "markup.deleted"
    },
    {
      foreground: "50fa7b",
      token: "markup.inserted"
    },
    {
      foreground: "e6db74",
      token: "markup.changed"
    },
    {
      foreground: "bd93f9",
      token: "constant.numeric.line-number.find-in-files - match"
    },
    {
      foreground: "e6db74",
      token: "entity.name.filename"
    },
    {
      foreground: "f83333",
      token: "message.error"
    },
    {
      foreground: "eeeeee",
      token: "punctuation.definition.string.begin.json - meta.structure.dictionary.value.json"
    },
    {
      foreground: "eeeeee",
      token: "punctuation.definition.string.end.json - meta.structure.dictionary.value.json"
    },
    {
      foreground: "8be9fd",
      token: "meta.structure.dictionary.json string.quoted.double.json"
    },
    {
      foreground: "f1fa8c",
      token: "meta.structure.dictionary.value.json string.quoted.double.json"
    },
    {
      foreground: "50fa7b",
      token: "meta meta meta meta meta meta meta.structure.dictionary.value string"
    },
    {
      foreground: "ffb86c",
      token: "meta meta meta meta meta meta.structure.dictionary.value string"
    },
    {
      foreground: "ff79c6",
      token: "meta meta meta meta meta.structure.dictionary.value string"
    },
    {
      foreground: "bd93f9",
      token: "meta meta meta meta.structure.dictionary.value string"
    },
    {
      foreground: "50fa7b",
      token: "meta meta meta.structure.dictionary.value string"
    },
    {
      foreground: "ffb86c",
      token: "meta meta.structure.dictionary.value string"
    }
  ],
  colors: {
    "editor.foreground": "#ABB2BF",
    "editor.background": "#282a36",
    "editor.selectionBackground": "#515151",
    "editor.lineHighlightBackground": "#292C33",
    "editorCursor.foreground": "#CCCCCC",
    "editorWhitespace.foreground": "#6A6A6A"
  }
});
