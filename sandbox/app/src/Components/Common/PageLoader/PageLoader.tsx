import React from "react";

import logo from "../../../Assets/toolkit-logo.png";
import s from "./PageLoader.module.scss";

export function PageLoader(): JSX.Element | null {
  return (
    <div className={s.container}>
      <img className={s.logo} src={logo} />
    </div>
  );
}
