import React from "react";

import { assets } from "../../Assets";
import * as styles from "./PageLoader.module.scss";

export function PageLoader(): JSX.Element | null {
  return (
    <div className={styles.container}>
      <img className={styles.logo} src={assets.logo.toolkit} width={150} height={150} alt="Valkyr Logo" />
    </div>
  );
}
