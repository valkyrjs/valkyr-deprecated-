import { LedgerService } from "@valkyr/client";
import { useQuery } from "@valkyr/react";
import { useEffect } from "react";

import { AuthService } from "../../Auth/Services/AuthService";
import { useProvider } from "../../Module";
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
