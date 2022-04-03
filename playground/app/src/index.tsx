import { useRouter } from "@valkyr/react";
import React, { Fragment, ReactElement } from "react";
import { createRoot } from "react-dom/client";

import { PageLoader } from "./Components/Loader";
import { setup } from "./Setup";

// Router.events.on("routeChangeStart", nProgress.start);
// Router.events.on("routeChangeError", nProgress.done);
// Router.events.on("routeChangeComplete", nProgress.done);

/*
 |--------------------------------------------------------------------------------
 | React
 |--------------------------------------------------------------------------------
 */

createRoot(document.getElementById("app")).render(<App />);

/*
 |--------------------------------------------------------------------------------
 | App
 |--------------------------------------------------------------------------------
 */

function App(): ReactElement {
  const view = useRouter(setup, handleError);
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

function handleError(err: any): ReactElement {
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

if (module.hot) {
  module.hot.accept();
}
