import React from "react";

import { useInviteForm } from "../Hooks/UseInviteForm";
import { useWorkspaceForm } from "../Hooks/UseWorkspaceForm";
import { useWorkspaces } from "../Hooks/UseWorkspaces";
import { Workspace as WorkspaceInstance } from "../Models/Workspace";
import { Avatar } from "../Modules/Auth";
import styles from "../Styles/Pages/Home.module.scss";

export function Home(): JSX.Element | null {
  return (
    <div className={styles.container}>
      <Avatar />
      <WorkspaceForm />
      <Workspaces />
    </div>
  );
}

function Workspaces() {
  const workspaces = useWorkspaces();
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
