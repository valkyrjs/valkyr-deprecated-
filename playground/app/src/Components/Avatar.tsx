import React from "react";
import styled from "styled-components";

import { useAccount } from "../Hooks/UseAccount";
import { Link } from "./Link";

/*
 |--------------------------------------------------------------------------------
 | Component
 |--------------------------------------------------------------------------------
 */

export function Avatar() {
  const account = useAccount();
  if (account) {
    return <Account email={account.email} />;
  }
  return <Guest />;
}

/*
 |--------------------------------------------------------------------------------
 | Inner Components
 |--------------------------------------------------------------------------------
 */

function Account({ email }: { email: string }) {
  return (
    <S.Container>
      Hi, {email}. <Link href="/account">Account</Link>
    </S.Container>
  );
}

function Guest() {
  return <S.Container>Guest</S.Container>;
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
  `
};
