import React from "react";
import styled from "styled-components";

import { Account as Model } from "~Data";
import { useAccount } from "~Hooks/UseAccount";

import { Link } from "./Link";

/*
 |--------------------------------------------------------------------------------
 | Component
 |--------------------------------------------------------------------------------
 */

export function Avatar() {
  const [account] = useAccount();
  if (account !== undefined) {
    return <Welcome account={account} />;
  }
  return <Guest />;
}

/*
 |--------------------------------------------------------------------------------
 | Inner Components
 |--------------------------------------------------------------------------------
 */

function Welcome({ account }: { account: Model }) {
  return (
    <S.Container>
      Hi, {account.name?.given ?? account.email}. <Link href="/account">Account</Link>
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
