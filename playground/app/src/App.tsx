import { useRouter } from "@valkyr/react";
import React, { Fragment, ReactElement } from "react";

import { PageLoader } from "./Components/PageLoader";
import { setup } from "./Setup";
import { GlobalStyle } from "./Styles";

/*
 |--------------------------------------------------------------------------------
 | App
 |--------------------------------------------------------------------------------
 */

export function App(): ReactElement {
  const view = useRouter(setup, handleError);
  if (!view) {
    return (
      <Fragment>
        <GlobalStyle />
        <PageLoader />
      </Fragment>
    );
  }
  return (
    <Fragment>
      <GlobalStyle />
      {view}
    </Fragment>
  );
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
