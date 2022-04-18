import { router } from "@valkyr/react";
import styled from "styled-components";

import { TodoList } from "../../Todo/TodoList";
import { WorkspaceInvites } from "../Components/WorkspaceInvites";
import { useWorkspace } from "../Hooks/UseWorkspace";

/*
 |--------------------------------------------------------------------------------
 | Component
 |--------------------------------------------------------------------------------
 */

export function Workspace() {
  const workspace = useWorkspace(router.params.get("workspace"));
  if (workspace === undefined) {
    return <div>Workspace does not exist, or has been removed</div>;
  }
  return (
    <S.Container>
      <div>{workspace.name}</div>
      <WorkspaceInvites workspaceId={workspace.id} />
      <TodoList />
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
