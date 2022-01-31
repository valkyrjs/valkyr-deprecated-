import "../styles/globals.css";
import "../styles/nprogress.css";

import Router from "next/router";
import nProgress from "nprogress";
import { Fragment, ReactElement } from "react";

import { PageLoader } from "../features/Loader/PageLoader";
import { useRouter } from "../router/Hooks/useRouter";

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

/*
 |--------------------------------------------------------------------------------
 | App
 |--------------------------------------------------------------------------------
 */

export default function App(): ReactElement {
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
