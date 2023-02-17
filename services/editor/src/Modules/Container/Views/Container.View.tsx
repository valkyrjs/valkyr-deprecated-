import { CodeEditor } from "~Components/CodeEditor";

import { ContainerController } from "./Container.Controller";

export const ContainerView = ContainerController.view(() => {
  return <CodeEditor defaultValue="" onChange={() => {}} />;
});
