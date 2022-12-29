import { Document } from "@valkyr/db";
import { EventRecord as EventRecordData } from "@valkyr/ledger";

export type EventRecord = Document & EventRecordData;
