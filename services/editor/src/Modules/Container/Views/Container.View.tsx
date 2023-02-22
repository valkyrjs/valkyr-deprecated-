import { CodeEditor } from "~Components/CodeEditor";

import { ContainerController } from "./Container.Controller";

export const ContainerView = ContainerController.view(({ state: { code }, actions: { onChange } }) => {
  return <CodeEditor defaultValue={code.value} onChange={onChange} />;
});
