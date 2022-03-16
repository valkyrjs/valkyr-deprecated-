import React from "react";

import { Avatar } from "../Modules/Auth";
import styles from "../Styles/Pages/Home.module.scss";

export function Home(): JSX.Element | null {
  return (
    <div className={styles.container}>
      <Avatar />
    </div>
  );
}
