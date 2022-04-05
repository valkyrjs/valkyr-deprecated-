import { useInviteForm } from "~Hooks/UseInviteForm";

export function WorkspaceInviteForm({ workspaceId }: { workspaceId: string }) {
  const [register, { submit }] = useInviteForm(workspaceId);
  return (
    <form key={`invite-${workspaceId}`} onSubmit={submit}>
      <input placeholder="Invite email" {...register("email")} />
      <button type="submit">Create</button>
    </form>
  );
}
