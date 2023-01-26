import "./styles.css";
import "./modules";
import "./monaco";

import { createElement, ReactElement, StrictMode } from "react";
import { createRoot } from "react-dom/client";

import { config } from "./config";
import { router } from "./services/router";

const app = createRoot(document.getElementById("app")!);

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
