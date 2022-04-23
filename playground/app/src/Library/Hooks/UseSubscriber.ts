import { LedgerService, RemoteService } from "@valkyr/client";
import { useEffect, useState } from "react";

import { useProvider } from "~App";

type Entity = {
  id: string;
};

export function useSubscriber(entities: Entity[], endpoint?: string) {
  const [ledger, remote] = useProvider(LedgerService, RemoteService);
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    setIds(entities.map((entity) => entity.id));
    if (endpoint) {
      remote.get<string[]>(endpoint).then(setIds);
    }
  }, [endpoint]);

  useEffect(() => {
    const subscriptions = ids.map((id) => ledger.subscribe(id));
    return () => {
      for (const unsubscribe of subscriptions) {
        unsubscribe();
      }
    };
  }, [JSON.stringify(ids)]);
}
