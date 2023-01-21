import { EventStore } from "@valkyr/event-store";
import { EventRecord } from "@valkyr/ledger";

import { db } from "../../services/database";

export const ledger = new EventStore<"server">(db.collection<EventRecord>("events"));
