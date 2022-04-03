import React from "react";

import { Pin } from "../../../Components/Pin";
import { useToken } from "../Hooks/UseToken";
import s from "./Styles/Token.module.scss";

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
