import { LedgerService } from "@valkyr/client";
import { useEffect } from "react";

import { useProvider } from "~App";
import { useQuery } from "~Library/Hooks/UseQuery";

import { AuthService } from "../../Auth/Services/AuthService";
import { Account } from "../Model";

export function useAccount() {
  const auth = useProvider(AuthService);
  const ledger = useProvider(LedgerService);

  const account = useQuery(Account, { filter: { id: auth.auditor }, limit: 1 });

  useEffect(() => {
    if (auth.isAuthenticated) {
      return ledger.subscribe(auth.auditor);
    }
  }, [auth.auditor]);

  return account;
}
