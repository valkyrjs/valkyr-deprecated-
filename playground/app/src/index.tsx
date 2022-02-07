import React, { Fragment, ReactElement } from "react";
import ReactDOM from "react-dom";

import { PageLoader } from "./Features/Loader/PageLoader";
import { useRouter } from "./Router/Hooks/UseRouter";

// Router.events.on("routeChangeStart", nProgress.start);
// Router.events.on("routeChangeError", nProgress.done);
// Router.events.on("routeChangeComplete", nProgress.done);

/*
 |--------------------------------------------------------------------------------
 | React
 |--------------------------------------------------------------------------------
 */

ReactDOM.render(<App />, document.getElementById("app"));

/*
 |--------------------------------------------------------------------------------
 | App
 |--------------------------------------------------------------------------------
 */

function App(): ReactElement {
  const view = useRouter(handleError);
  if (!view) {
    return (
      <Fragment>
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
