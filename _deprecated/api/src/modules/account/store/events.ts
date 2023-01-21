import { Event as LedgerEvent, EventToRecord, makeEvent } from "@valkyr/ledger";

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export const accountCreated = makeEvent<AccountCreated>("AccountCreated");

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
 | Event Union
 |--------------------------------------------------------------------------------
 */

export type AccountEvent = AccountCreated;

export type AccountEventRecord = EventToRecord<AccountEvent>;
