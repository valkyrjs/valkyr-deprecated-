import { ledger } from "@valkyr/client";
import { useQuery } from "@valkyr/react";
import { useEffect } from "react";

import { Workspace } from "~Data";

export function useWorkspace(id: string) {
  const workspace = useQuery(Workspace, { filter: { id }, limit: 1 });

  useEffect(() => ledger.subscribe(id), [id]);

  return workspace;
}
