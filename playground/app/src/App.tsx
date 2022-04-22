import React, { Fragment, ReactElement } from "react";

import { useApp } from "./App/Hooks";
import { GlobalStyle } from "./Styles";

export function App(): ReactElement {
  const view = useApp();
  if (!view) {
    return null;
  }
  return (
    <Fragment>
      <GlobalStyle />
      {view}
    </Fragment>
  );
}
