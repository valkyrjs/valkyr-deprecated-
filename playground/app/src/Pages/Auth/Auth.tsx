import React from "react";
import styled from "styled-components";

import { assets } from "~Assets";
import { color } from "~Styles";

import { Email } from "./Components/Email";
import { Token } from "./Components/Token";
import { useAuth } from "./Hooks/UseAuth";

/*
 |--------------------------------------------------------------------------------
 | Component
 |--------------------------------------------------------------------------------
 */

export function Auth() {
  const [{ step, email }, { dispatch }] = useAuth();
  return (
    <S.Container>
      <S.Logo>
        <img src={assets.logo.toolkit.toString()} alt="Valkyr Logo" width={70} height={70} />
        Valkyr Toolkit
      </S.Logo>
      {step === "email" ? <Email dispatch={dispatch} /> : <Token email={email as string} />}
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
    display: flex;
    flex-direction: column;
    align-items: center;

    height: 100%;

    h1 {
      font-weight: 700;
      font-size: 48px;
      line-height: 46px;
      max-width: 700px;
      text-align: center;
      letter-spacing: -0.75px;
      margin-bottom: 20px;
    }

    input {
      background-color: transparent;

      border: 1px solid #ccc;
      border-radius: 6px;

      font-size: 16px;

      box-sizing: border-box;
      margin-bottom: 20px;
      padding: 16px 13px;
      width: 100%;
    }

    button {
      background-color: ${color.primary.default};
      border: none;
      border-radius: 6px;
      color: #fff;
      font-size: 15px;

      min-width: 180px;
      padding: 16px;

      &:hover {
        background-color: ${color.primary.dark};
        cursor: pointer;
      }

      width: 100%;
    }
  `,
  Logo: styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;

    font-size: 18px;
    margin-top: 30px;
    margin-bottom: 30px;

    img {
      width: 70px;
      height: auto;
      margin-right: 10px;
    }
  `
};
