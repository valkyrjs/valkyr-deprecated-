import "./App.scss";

import React, { Fragment } from "react";

import { PageLoader } from "./Components/Common/PageLoader";
import { RouteLoader } from "./Components/Common/RouteLoader";
import { useRouter } from "./Hooks/UseRouter";

/*
 |--------------------------------------------------------------------------------
 | App
 |--------------------------------------------------------------------------------
 */

export function App(): JSX.Element {
  const view = useRouter(handleError);
  if (!view) {
    return (
      <Fragment>
        <RouteLoader />
        <PageLoader />
      </Fragment>
    );
  }
  return view;
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

function handleError(err: any): JSX.Element {
  return (
    <div className="flex h-screen">
      <div className="m-auto">
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
