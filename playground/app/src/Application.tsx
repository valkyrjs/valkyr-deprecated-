import { Fragment, ReactElement } from "react";

import { useApp } from "~App";

import { GlobalStyle } from "./Styles";

export function Application(): ReactElement {
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
