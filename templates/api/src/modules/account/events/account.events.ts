import * as Ledger from "@valkyr/ledger";
import { Event as LedgerEvent, makeEvent } from "@valkyr/ledger";

/*
 |--------------------------------------------------------------------------------
 | Event Factories
 |--------------------------------------------------------------------------------
 */

export const event = {
  accountCreated: makeEvent<AccountCreated>("AccountCreated")
} as const;

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export type AccountCreated = LedgerEvent<
  "AccountCreated",
  {
    email: string;
    password: string;
  }
>;

/*
 |--------------------------------------------------------------------------------
 | Event Records
 |--------------------------------------------------------------------------------
 */

export type EventRecord = Ledger.EventRecord<AccountCreated>;
