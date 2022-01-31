import React from "react";

import { Avatar } from "../Features/Auth";
import styles from "../Styles/Pages/Home.module.scss";

export function Home(): JSX.Element | null {
  return (
    <div className={styles.container}>
      <Avatar />
    </div>
  );
}
