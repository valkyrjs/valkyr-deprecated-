import React from "react";

import { assets } from "../Assets";
import { Email, Token, useAuth } from "../Modules/Auth";
import styles from "../Styles/Pages/Auth.module.scss";

export function Auth() {
  const [{ step, email }, { dispatch }] = useAuth();
  return (
    <div className={styles.container}>
      <div className={styles.logo}>
        <img src={assets.logo.toolkit.toString()} alt="Valkyr Logo" width={70} height={70} />
        Valkyr Toolkit
      </div>
      {step === "email" ? <Email dispatch={dispatch} /> : <Token email={email as string} />}
    </div>
  );
}
