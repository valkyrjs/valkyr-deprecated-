import { EventRecord } from "@valkyr/ledger";

import { method } from "../../../services/jsonrpc";
import { ledger } from "../ledger";

export const addEvent = method<EventRecord>(async (event) => {
  await ledger.insert(event);
});
