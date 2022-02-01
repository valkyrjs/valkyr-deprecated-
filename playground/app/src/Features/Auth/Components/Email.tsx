import React from "react";

import { useEmail } from "../Hooks/UseEmail";
import { AuthDispatch } from "../Reducer";
import styles from "./Styles/Email.module.scss";

type Props = {
  dispatch: AuthDispatch;
};

export function Email({ dispatch }: Props) {
  const [register, { submit }] = useEmail(dispatch);
  return (
    <div className={styles.container}>
      <h1>Sign in</h1>
      <p>Enter your email to get started.</p>
      <form onSubmit={submit}>
        <input placeholder="name@business.com" {...register("email")} />
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}
