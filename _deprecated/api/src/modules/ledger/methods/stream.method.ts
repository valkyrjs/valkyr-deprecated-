import { EventRecord } from "@valkyr/ledger";

import { method } from "../../../services/jsonrpc";
import { ledger } from "../ledger";

export const getEventStream = method<EventStreamParams, EventRecord[]>(async ({ stream, cursor }) => {
  return ledger.pull(stream, cursor);
});

type EventStreamParams = {
  stream: string;
  cursor?: string;
};
