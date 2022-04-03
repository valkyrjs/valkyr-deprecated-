import { useEffect } from "react";

import { auth } from "../Auth";
import { remote, Workspace } from "../Data";
import { useQuery } from "./UseQuery";

export function useWorkspaces() {
  const workspaces = useQuery(Workspace, { filter: { "members.accountId": auth.auditor } });

  useEffect(() => {
    remote.get("/workspaces").then((res) => {
      if (res.status === "success") {
        for (const document of res.data) {
          Workspace.upsert(document);
        }
      }
    });
  }, []);

  return workspaces;
}
