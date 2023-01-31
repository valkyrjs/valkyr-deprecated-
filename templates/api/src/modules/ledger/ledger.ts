import { EventStore } from "@valkyr/event-store";

import { EventRecord } from "~generated/events";
import { db } from "~services/database";

export const ledger = new EventStore<"server", EventRecord>(db.collection<EventRecord>("events"));
