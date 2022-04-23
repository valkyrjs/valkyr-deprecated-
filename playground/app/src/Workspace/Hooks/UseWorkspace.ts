import { LedgerService } from "@valkyr/client";
import { useEffect } from "react";

import { useProvider } from "~App";
import { useQuery } from "~Library/Hooks/UseQuery";

import { Workspace } from "../Model";

export function useWorkspace(id: string) {
  const workspace = useQuery(Workspace, { filter: { id }, limit: 1 });
  const ledger = useProvider(LedgerService);

  useEffect(() => ledger.subscribe(id), [id]);

  return workspace;
}
