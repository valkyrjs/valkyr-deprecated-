import { CodeEditorController } from "./code-editor.controller";

export const CodeEditorView = CodeEditorController.view(({ refs }) => {
  return <div className="h-screen w-screen" ref={refs.set("editor")}></div>;
});
