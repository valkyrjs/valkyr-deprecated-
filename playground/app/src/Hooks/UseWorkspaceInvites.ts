import { ApiErrorResponse, remote } from "@valkyr/client";
import { useEffect, useState } from "react";

import { Invite } from "~Data/Models/Invite";

export function useWorkspaceInvites(workspaceId: string): [Invite[], boolean, ApiErrorResponse | undefined] {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<ApiErrorResponse | undefined>();

  useEffect(() => {
    remote
      .get<Invite[]>(`/workspaces/${workspaceId}/invites`)
      .then(setInvites)
      .catch(setError)
      .finally(() => {
        setLoading(false);
      });
  }, [workspaceId]);

  return [invites, loading, error];
}
