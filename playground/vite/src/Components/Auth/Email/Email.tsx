import React from "react";

import { useEmail } from "../../../Hooks/Auth/UseEmail";
import type { AuthDispatch } from "../../../Reducers/Auth";
import s from "./Email.module.scss";

type Props = {
  dispatch: AuthDispatch;
};

export function Email({ dispatch }: Props) {
  const [register, { submit }] = useEmail(dispatch);
  return (
    <div className={s.container}>
      <h1>Sign in</h1>
      <p>Enter your email to get started.</p>
      <form onSubmit={submit}>
        <input placeholder="name@business.com" {...register("email")} />
        <button type="submit">Continue</button>
      </form>
    </div>
  );
}
