import Image from "next/image";
import React from "react";

import styles from "./Styles/PageLoader.module.scss";

export function PageLoader(): JSX.Element | null {
  return (
    <div className={styles.container}>
      <Image className={styles.logo} src="/toolkit-logo.png" width={150} height={150} alt="Valkyr Logo" />
    </div>
  );
}
