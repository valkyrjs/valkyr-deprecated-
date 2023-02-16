import * as monaco from "monaco-editor";

export const FILE_ROOT_PATH = "inmemory://model/";

/*
 |--------------------------------------------------------------------------------
 | Validation Options
 |--------------------------------------------------------------------------------
 */

monaco.languages.typescript.typescriptDefaults.setDiagnosticsOptions({
  ...monaco.languages.typescript.typescriptDefaults.getDiagnosticsOptions(),
  noSemanticValidation: true,
  noSyntaxValidation: false
});

/*
 |--------------------------------------------------------------------------------
 | Compiler Options
 |--------------------------------------------------------------------------------
 */

monaco.languages.typescript.typescriptDefaults.setCompilerOptions({
  ...monaco.languages.typescript.typescriptDefaults.getCompilerOptions(),
  moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
  allowSyntheticDefaultImports: true,
  rootDir: FILE_ROOT_PATH
});
