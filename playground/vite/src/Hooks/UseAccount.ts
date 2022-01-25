import { subscribe } from "@valkyr/ledger";
import { useEffect } from "react";

import { auth } from "../Auth";
import { useQuery } from "./UseQuery";

export function useAccount() {
  const account = useQuery("accounts", { filter: { id: auth.auditor }, singleton: true });

  useEffect(() => {
    if (auth.isAuthenticated) {
      return subscribe(auth.auditor);
    }
  }, [auth]);

  return account;
}
