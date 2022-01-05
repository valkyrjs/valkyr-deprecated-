import React from "react";

import { useToken } from "../../../Hooks/Auth/UseToken";
import { Pin } from "../../Common/Pin";
import s from "./Token.module.scss";

type Props = {
  email: string;
};

export function Token({ email }: Props) {
  const [inputs, { submit }] = useToken(email);
  return (
    <div className={s.container}>
      <h1>Enter token</h1>
      <p>
        We’ve sent a 6-character code to <b>{email}</b>.
      </p>
      <Pin className={s.pin} inputs={inputs} size={6} onComplete={submit} />
      <p>Can’t find your code? Check your spam folder!</p>
    </div>
  );
}
