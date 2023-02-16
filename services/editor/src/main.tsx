import "./Styles/index.css";
import "./Modules";
import "./Monaco";

import { getPackageByName, getPackageFile, getPackageFiles, getPackages, resolvePackage } from "@valkyr/monaco";
import { createElement, ReactElement, StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { config } from "./Config";
import { router } from "./Services/Router";

const app = createRoot(document.getElementById("root") as HTMLElement);

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
 | Testing
 |--------------------------------------------------------------------------------
 */

declare global {
  interface Window {
    pkm: {
      resolve: typeof resolvePackage;
      packages: typeof getPackages;
      package: typeof getPackageByName;
      files: typeof getPackageFiles;
      file: typeof getPackageFile;
    };
  }
}

window.pkm = {
  resolve: resolvePackage,
  packages: getPackages,
  package: getPackageByName,
  files: getPackageFiles,
  file: getPackageFile
};
