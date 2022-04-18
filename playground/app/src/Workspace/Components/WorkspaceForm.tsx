import { useWorkspaceForm } from "../../Workspace/Hooks/UseWorkspaceForm";

export function WorkspaceForm() {
  const [register, { submit }] = useWorkspaceForm();
  return (
    <form key="workspace" style={{ marginBottom: 30 }} onSubmit={submit}>
      <input placeholder="Workspace name" {...register("name")} />
      <button type="submit">Create</button>
    </form>
  );
}
