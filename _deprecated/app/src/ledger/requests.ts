import { makeRequestFactory } from "@valkyr/jsonrpc";
import { EventRecord } from "@valkyr/ledger";

import { ws } from "../jsonrpc";

export const requests = {
  addEvent: makeRequestFactory<EventRecord>("addEvent", ws),
  getEventStream: makeRequestFactory<EventStreamParams, EventRecord[]>("getEventStream", ws),
  getEventStreamContainer: makeRequestFactory<EventContainerParams, EventRecord[]>("getEventStreamContainer", ws)
};

type EventStreamParams = { stream: string; cursor?: string };

type EventContainerParams = { container: string; cursor?: string };
