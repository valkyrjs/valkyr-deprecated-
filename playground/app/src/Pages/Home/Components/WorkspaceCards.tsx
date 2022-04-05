import styled from "styled-components";

import { useWorkspaces } from "~Hooks/UseWorkspaces";

import { WorkspaceCard } from "./WorkspaceCard";

export function WorkspaceCards() {
  const workspaces = useWorkspaces();
  return (
    <S.Container>
      <h1>Workspaces</h1>
      {workspaces.map((workspace) => (
        <WorkspaceCard key={workspace.id} workspace={workspace} />
      ))}
    </S.Container>
  );
}

const S = {
  Container: styled.div`
    > div {
      margin-bottom: 20px;
    }
  `
};
