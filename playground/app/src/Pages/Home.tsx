import React from "react";
import styled from "styled-components";

import { Avatar } from "../Components/Avatar";
import { Workspace as WorkspaceInstance } from "../Data";
import { useInviteForm } from "../Hooks/UseInviteForm";
import { useWorkspaceForm } from "../Hooks/UseWorkspaceForm";
import { useWorkspaces } from "../Hooks/UseWorkspaces";

/*
 |--------------------------------------------------------------------------------
 | Component
 |--------------------------------------------------------------------------------
 */

export function Home(): JSX.Element | null {
  return (
    <S.Container>
      <Avatar />
      <WorkspaceForm />
      <Workspaces />
    </S.Container>
  );
}

/*
 |--------------------------------------------------------------------------------
 | Inner Components
 |--------------------------------------------------------------------------------
 */

function Workspaces() {
  const [workspaces, loading, error] = useWorkspaces();
  if (loading) {
    return <div>Loading</div>;
  }
  if (error) {
    return <div>{error.message}</div>;
  }
  return (
    <div>
      <h1>Workspaces</h1>
      {workspaces.map((workspace) => (
        <Workspace key={workspace.id} workspace={workspace} />
      ))}
    </div>
  );
}

function Workspace({ workspace }: { workspace: WorkspaceInstance }) {
  return (
    <div style={{ marginBottom: 30 }}>
      {workspace.name}
      <InviteForm workspaceId={workspace.id} />
    </div>
  );
}

function InviteForm({ workspaceId }: { workspaceId: string }) {
  const [register, { submit }] = useInviteForm(workspaceId);
  return (
    <form key={`invite-${workspaceId}`} onSubmit={submit}>
      <input placeholder="Invite email" {...register("email")} />
      <button type="submit">Create</button>
    </form>
  );
}

function WorkspaceForm() {
  const [register, { submit }] = useWorkspaceForm();
  return (
    <form key="workspace" style={{ marginBottom: 30 }} onSubmit={submit}>
      <input placeholder="Workspace name" {...register("name")} />
      <button type="submit">Create</button>
    </form>
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
