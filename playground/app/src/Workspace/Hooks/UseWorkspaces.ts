import { auth } from "@valkyr/client";
import { useQuery, useSubscriber } from "@valkyr/react";

import { Workspace } from "../Model";

export function useWorkspaces() {
  const workspaces = useQuery(Workspace, {
    filter: {
      "members.accountId": auth.auditor
    }
  });

  useSubscriber(workspaces, "/workspaces");

  return workspaces;
}
