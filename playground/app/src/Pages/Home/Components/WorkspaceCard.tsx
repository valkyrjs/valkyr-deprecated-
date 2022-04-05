import styled from "styled-components";

import { Link } from "~Components/Link";
import { Workspace } from "~Data";

/*
 |--------------------------------------------------------------------------------
 | Component
 |--------------------------------------------------------------------------------
 */

export function WorkspaceCard({ workspace }: { workspace: Workspace }) {
  return (
    <S.Container>
      <div>
        {workspace.name} [{workspace.members.size} member{workspace.members.size !== 1 && "s"}]
      </div>
      <div>
        <Link href={`/workspaces/${workspace.id}`}>Select</Link>
      </div>
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
    display: grid;

    border: 1px solid #ccc;
    border-radius: 5px;
    padding: 10px;
  `
};
