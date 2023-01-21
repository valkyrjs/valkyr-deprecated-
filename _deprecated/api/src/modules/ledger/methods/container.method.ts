import { EventRecord } from "@valkyr/ledger";

import { method } from "../../../services/jsonrpc";
import { ledger } from "../ledger";

export const getEventContainer = method<EventContainerParams, EventRecord[]>(async ({ container, cursor }) => {
  const filter: any = {
    meta: {
      container
    }
  };
  if (cursor !== undefined) {
    filter.recorded = {
      $gt: cursor
    };
  }
  return ledger.collection.find(filter, { sort: { recorded: 1 } }).toArray();
});

type EventContainerParams = {
  container: string;
  cursor?: string;
};
