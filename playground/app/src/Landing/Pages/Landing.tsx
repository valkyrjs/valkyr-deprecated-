import styled from "styled-components";

import { useConfig } from "~App";
import { Link } from "~Library/Components/Link";

/*
 |--------------------------------------------------------------------------------
 | Component
 |--------------------------------------------------------------------------------
 */

export function Landing() {
  const appName = useConfig("app.name");
  return (
    <S.Container>
      <div>{appName}</div>
      <ul>
        <li>
          <Link href="/signin">Signin</Link>
        </li>
        <li>
          <Link href="/workspaces">Workspaces</Link>
        </li>
      </ul>
    </S.Container>
  );
}

/*
 |--------------------------------------------------------------------------------
 | Styles
 |--------------------------------------------------------------------------------
 */

const S = {
  Container: styled.div``
};
