import "../styles/globals.css";
import "../styles/nprogress.css";

import type { AppProps } from "next/app";
import Router from "next/router";
import nProgress from "nprogress";
import { Fragment } from "react";

import { PageLoader } from "../features/loader/pageLoader";
import { useRouter } from "../router/hooks/useRouter";

Router.events.on("routeChangeStart", nProgress.start);
Router.events.on("routeChangeError", nProgress.done);
Router.events.on("routeChangeComplete", nProgress.done);

/*
 |--------------------------------------------------------------------------------
 | App
 |--------------------------------------------------------------------------------
 */

export default function App() {
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
