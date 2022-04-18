import React from "react";
import styled from "styled-components";

import { useToken } from "../Hooks/UseToken";
import { Pin } from "./Pin";

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type Props = {
  email: string;
};

/*
 |--------------------------------------------------------------------------------
 | Component
 |--------------------------------------------------------------------------------
 */

export function Token({ email }: Props) {
  const [inputs, { submit }] = useToken(email);
  return (
    <S.Container>
      <h1>Enter token</h1>
      <p>
        WeU+2019ve sent a 6-character code to <b>{email}</b>.
      </p>
      <S.Pin inputs={inputs} size={6} onComplete={submit} />
      <p>CanU+2019t find your code? Check your spam folder!</p>
    </S.Container>
  );
}

/*
 |--------------------------------------------------------------------------------
 | Styles
 |--------------------------------------------------------------------------------
 */

const S = {
  Container: styled.div`
    h1 {
      font-size: 38px;
      text-transform: uppercase;
    }
    p {
      text-align: center;
    }
  `,
  Pin: styled(Pin)`
    max-width: 560px;
    justify-content: center;
    column-gap: 3px;

    padding: 20px;

    input {
      font-size: 26px;

      margin: 0;
      padding: 0;

      height: 60px !important;
      width: 60px !important;

      &:nth-child(3n) {
        margin-right: 20px;
      }
    }
  `
};
