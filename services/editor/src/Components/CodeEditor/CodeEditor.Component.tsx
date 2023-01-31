import { CodeEditorController } from "./CodeEditor.Controller";

export const CodeEditor = CodeEditorController.view(({ state: { id }, refs }) => {
  return <div className="h-full w-full" ref={refs.set(`editor:${id}`)}></div>;
});
