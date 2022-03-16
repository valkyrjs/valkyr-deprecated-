import { subscribe } from "@valkyr/ledger";
import { useEffect } from "react";

import { useQuery } from "../../../Hooks/UseQuery";
import { auth } from "../../Auth/Auth";

export function useAccount() {
  const account = useQuery("accounts", { filter: { id: auth.auditor }, singleton: true });

  useEffect(() => {
    if (auth.isAuthenticated) {
      return subscribe(auth.auditor);
    }
  }, [auth.auditor]);

  return account;
}
