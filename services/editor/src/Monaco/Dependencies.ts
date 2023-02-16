import { getPackageFiles, getPackages } from "@valkyr/monaco";
import * as monaco from "monaco-editor";

import { FILE_ROOT_PATH } from "./Options";

getPackages().then((packages) => {
  for (const pkg of packages) {
    createModel(JSON.stringify(pkg, null, 2), `${FILE_ROOT_PATH}node_modules/${pkg.name}/package.json`);
    getPackageFiles(pkg.name).then((files) => {
      for (const file of files) {
        createModel(file.body, `${FILE_ROOT_PATH}node_modules/${pkg.name}${file.path}`);
      }
    });
  }
});

function createModel(source: string, uri: string): void {
  monaco.editor.createModel(source, "typescript", monaco.Uri.parse(uri));
}
