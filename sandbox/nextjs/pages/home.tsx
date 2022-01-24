import React from "react";

import { Avatar } from "../features/auth";
import styles from "../styles/pages/home.module.scss";

export function Home(): JSX.Element | null {
  return (
    <div className={styles.container}>
      <Avatar />
    </div>
  );
}
