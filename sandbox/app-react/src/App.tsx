import "./Styles.css";

import { Fragment, ReactElement } from "react";

import { config } from "./Config";
import { useRouter } from "./Hooks/UseRouter";
import { setup } from "./Setup";

/*
 |--------------------------------------------------------------------------------
 | App
 |--------------------------------------------------------------------------------
 */

export function App(): ReactElement {
  const view = useRouter(setup, handleError);
  if (view === undefined) {
    return <Fragment>Loading</Fragment>;
  }
  return <Fragment>{view}</Fragment>;
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
