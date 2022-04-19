import { useQuery, useSubscriber } from "@valkyr/react";

import { AuthService } from "../../Auth/Services/AuthService";
import { useProvider } from "../../Module";
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
