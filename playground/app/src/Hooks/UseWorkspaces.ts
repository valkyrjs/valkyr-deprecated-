import { auth } from "@valkyr/client";

import { Workspace } from "../Data";
import { useQuery } from "./UseQuery";

export function useWorkspaces() {
  return useQuery(Workspace, {
    filter: {
      "members.accountId": auth.auditor
    },
    sync: Workspace.resolve.index
  });
}
