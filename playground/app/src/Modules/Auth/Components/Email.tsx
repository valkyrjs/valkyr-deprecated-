import React from "react";
import styled from "styled-components";

import { useEmail } from "../Hooks/UseEmail";
import { AuthDispatch } from "../Reducer";

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type Props = {
  dispatch: AuthDispatch;
};

/*
 |--------------------------------------------------------------------------------
 | Component
 |--------------------------------------------------------------------------------
 */

export function Email({ dispatch }: Props) {
  const [register, { submit }] = useEmail(dispatch);
  return (
    <S.Container>
      <h1>Sign in</h1>
      <p>Enter your email to get started.</p>
      <form onSubmit={submit}>
        <input placeholder="name@business.com" {...register("email")} />
        <button type="submit">Continue</button>
      </form>
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
    input {
      text-align: center;
    }
  `
};
