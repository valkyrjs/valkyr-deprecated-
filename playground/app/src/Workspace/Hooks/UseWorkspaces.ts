import { useProvider } from "~App";
import { useQuery } from "~Library/Hooks/UseQuery";
import { useSubscriber } from "~Library/Hooks/UseSubscriber";

import { AuthService } from "../../Auth/Services/AuthService";
import { Workspace } from "../Model";

export function useWorkspaces() {
  const auth = useProvider(AuthService);
  const workspaces = useQuery(Workspace, {
    filter: {
      "members.accountId": auth.auditor
    }
  });

  useSubscriber(workspaces, "/workspaces");

  return workspaces;
}
