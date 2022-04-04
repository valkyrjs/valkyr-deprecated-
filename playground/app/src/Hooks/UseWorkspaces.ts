import { auth } from "@valkyr/client";
import { useQuery } from "@valkyr/react";

import { Workspace } from "../Data";

export function useWorkspaces() {
  return useQuery(Workspace, {
    filter: {
      "members.accountId": auth.auditor
    },
    sync: Workspace.resolve.index
  });
}
