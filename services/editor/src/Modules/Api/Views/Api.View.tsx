import { CodeEditor } from "~Components/CodeEditor";

import { ApiController } from "./Api.Controller";

export const ApiView = ApiController.view(({ state: { code }, actions: { onChange } }) => {
  return <CodeEditor defaultValue={code.value} onChange={onChange} />;
});
