import React from "react";

import { useWorkspaceForm } from "../Hooks/UseWorkspaceForm";
import { useWorkspaces } from "../Hooks/UseWorkspaces";
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
  return <pre>{JSON.stringify(workspaces, null, 2)}</pre>;
}

function WorkspaceForm() {
  const [register, { submit }] = useWorkspaceForm();
  return (
    <form onSubmit={submit}>
      <input placeholder="Workspace name" {...register("name")} />
      <button type="submit">Create</button>
    </form>
  );
}
