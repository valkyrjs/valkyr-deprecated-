import React from "react";

import { Pin } from "../../Form/Components/Pin";
import { useToken } from "../Hooks/useToken";
import styles from "./styles/token.module.scss";

type Props = {
  email: string;
};

export function Token({ email }: Props) {
  const [inputs, { submit }] = useToken(email);
  return (
    <div className={styles.container}>
      <h1>Enter token</h1>
      <p>
        We’ve sent a 6-character code to <b>{email}</b>.
      </p>
      <Pin className={styles.pin} inputs={inputs} size={6} onComplete={submit} />
      <p>Can’t find your code? Check your spam folder!</p>
    </div>
  );
}
