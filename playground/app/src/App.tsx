import React, { Fragment, ReactElement } from "react";

import { PageLoader } from "~Library/Components/PageLoader";

import { app, AppContext, useApp } from "./Module";
import { setup } from "./Setup";
import { GlobalStyle } from "./Styles";

/*
 |--------------------------------------------------------------------------------
 | App
 |--------------------------------------------------------------------------------
 */

export function App(): ReactElement {
  const view = useApp(app);
  if (!view) {
    return (
      <Fragment>
        <GlobalStyle />
        <PageLoader />
      </Fragment>
    );
  }
  return (
    <AppContext.Provider value={app}>
      <GlobalStyle />
      {view}
    </AppContext.Provider>
  );
}

app.start(setup);
