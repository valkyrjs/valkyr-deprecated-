import { ledger } from "@valkyr/client";
import { useEffect } from "react";

import { auth } from "../Auth";
import { Account } from "../Data";
import { useQuery } from "./UseQuery";

export function useAccount() {
  const account = useQuery(Account, { filter: { id: auth.auditor }, singleton: true });

  useEffect(() => {
    if (auth.is("authenticated")) {
      return ledger.subscribe(auth.auditor);
    }
  }, [auth.auditor]);

  return account;
}
