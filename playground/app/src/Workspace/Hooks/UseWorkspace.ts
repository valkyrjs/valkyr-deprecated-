import { LedgerService } from "@valkyr/client";
import { useQuery } from "@valkyr/react";
import { useEffect } from "react";

import { useProvider } from "~App";

import { Workspace } from "../Model";

export function useWorkspace(id: string) {
  const workspace = useQuery(Workspace, { filter: { id }, limit: 1 });
  const ledger = useProvider(LedgerService);

  useEffect(() => ledger.subscribe(id), [id]);

  return workspace;
}
