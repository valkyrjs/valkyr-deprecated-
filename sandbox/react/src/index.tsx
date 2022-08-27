import "./Styles.css";
import "./Modules";

import { createElement, ReactElement } from "react";
import { createRoot } from "react-dom/client";

import { config } from "./Config";
import { router } from "./Services/Router";

const app = createRoot(document.getElementById("app"));

/*
 |--------------------------------------------------------------------------------
 | Router
 |--------------------------------------------------------------------------------
 */

const { pathname, search } = router.location;
router
  .listen({
    render: async (components: React.ComponentType[]) => {
      app.render(createReactElement(components));
    },
    error: (err: any) => {
      const component = handleError(err);
      if (component) {
        app.render(component);
      }
    }
  })
  .goTo(`${pathname}${search}`);

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

function createReactElement(list: React.ComponentType[]): any {
  if (list.length === 1) {
    return createElement(list[0], {});
  }
  return createElement(list[0], {}, createReactElement(list.slice(1, list.length)));
}
