import styled from "styled-components";

import { WorkspaceCards } from "../Components/WorkspaceCards";
import { WorkspaceForm } from "../Components/WorkspaceForm";

/*
 |--------------------------------------------------------------------------------
 | Component
 |--------------------------------------------------------------------------------
 */

export function Workspaces(): JSX.Element | null {
  return (
    <S.Container>
      <WorkspaceForm />
      <WorkspaceCards />
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
    padding: 40px;

    h1 {
      margin: 0 0 10px 0;
    }

    > div {
      margin-bottom: 30px;

      &:last-child {
        margin-bottom: 0;
      }
    }
  `
};
