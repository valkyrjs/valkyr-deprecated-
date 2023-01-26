import { CodeEditorController } from "./code-editor.controller";

export const CodeEditor = CodeEditorController.view(({ state: { id }, refs }) => {
  return <div className="h-full w-full" ref={refs.set(`editor:${id}`)}></div>;
});
