import { api } from "~api";
import { EventRecord } from "~generated/events";

import { method } from "../../../services/jsonrpc";
import { ledger } from "../ledger";

api.register<EventRecord>(
  "AddEvent",
  method(async (event) => {
    await ledger.insert(event);
  })
);

api.register<
  {
    stream: string;
    cursor?: string;
  },
  EventRecord[]
>(
  "GetEventStream",
  method(async ({ stream, cursor }) => {
    return ledger.pull(stream, cursor);
  })
);

api.register<
  {
    container: string;
    cursor?: string;
  },
  EventRecord[]
>(
  "GetEventContainer",
  method(async ({ container, cursor }) => {
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
  })
);
