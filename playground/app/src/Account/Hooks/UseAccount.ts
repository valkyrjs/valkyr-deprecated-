import { auth, ledger } from "@valkyr/client";
import { useQuery } from "@valkyr/react";
import { useEffect } from "react";

import { Account } from "../Model";

export function useAccount() {
  const account = useQuery(Account, { filter: { id: auth.auditor }, limit: 1 });

  useEffect(() => {
    if (auth.is("authenticated")) {
      return ledger.subscribe(auth.auditor);
    }
  }, [auth.auditor]);

  return account;
}
