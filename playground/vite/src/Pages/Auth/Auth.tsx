import React from "react";

import logo from "../../Assets/toolkit-logo.png";
import { Email } from "../../Components/Auth/Email";
import { Token } from "../../Components/Auth/Token";
import { useAuth } from "../../Hooks/Auth/UseAuth";
import s from "./Auth.module.scss";

export function Auth() {
  const [{ step, email }, { dispatch }] = useAuth();
  return (
    <div className={s.container}>
      <div className={s.logo}>
        <img src={logo} />
        CMDO Toolkit
      </div>
      {step === "email" ? <Email dispatch={dispatch} /> : <Token email={email} dispatch={dispatch} />}
    </div>
  );
}
