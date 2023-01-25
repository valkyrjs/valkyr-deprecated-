import "./styles.css";
import "./modules";

import * as monaco from "monaco-editor";
import { createElement, ReactElement, StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { config } from "./config";
import { router } from "./services/router";

const app = createRoot(document.getElementById("app"));

/*
 |--------------------------------------------------------------------------------
 | Router
 |--------------------------------------------------------------------------------
 */

router
  .render((component, props = {}) => {
    app.render(<StrictMode>{createElement(component, props)}</StrictMode>);
  })
  .error((error) => {
    const component = handleError(error);
    if (component) {
      app.render(component);
    }
  })
  .listen();

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

function handleError(err: any): ReactElement {
  return (
    <div className="flex h-screen">
      <div className="m-auto">
        <code>{JSON.stringify(config, null, 2)}</code>
        {err.message ? (
          <pre>
            {err.message}
            <br />
            {err.stack}
          </pre>
        ) : (
          <code>{JSON.stringify(err, null, 2)}</code>
        )}
      </div>
    </div>
  );
}

/*
 |--------------------------------------------------------------------------------
 | Monaco Code Editor
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
    "editor.background": "#282C34",
    "editor.selectionBackground": "#515151",
    "editor.lineHighlightBackground": "#292C33",
    "editorCursor.foreground": "#CCCCCC",
    "editorWhitespace.foreground": "#6A6A6A"
  }
});
