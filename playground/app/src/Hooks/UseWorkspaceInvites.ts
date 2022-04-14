import { useWorkspace } from "./UseWorkspace";

export function useWorkspaceInvites(workspaceId: string) {
  const workspace = useWorkspace(workspaceId);
  if (workspace === undefined) {
    return [];
  }
  return workspace.invites.getAll();
}
