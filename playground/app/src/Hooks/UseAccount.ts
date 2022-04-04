import { auth, ledger } from "@valkyr/client";
import { useQuery } from "@valkyr/react";
import { useEffect } from "react";

import { Account } from "../Data";

export function useAccount() {
  const state = useQuery(Account, { filter: { id: auth.auditor }, singleton: true });

  useEffect(() => {
    if (auth.is("authenticated")) {
      return ledger.subscribe(auth.auditor);
    }
  }, [auth.auditor]);

  return state;
}
