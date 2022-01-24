import Image from "next/image";
import React from "react";

import { Email, Token, useAuth } from "../features/auth";
import styles from "../styles/pages/auth.module.scss";

export function Auth() {
  const [{ step, email }, { dispatch }] = useAuth();
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <Image src="/toolkit-logo.png" alt="Valkyr Logo" width={70} height={70} />
        Valkyr Toolkit
      </div>
      {step === "email" ? <Email dispatch={dispatch} /> : <Token email={email as string} />}
    </div>
  );
}
