import { Event } from "@valkyr/ledger";

import { AccountState } from "./Aggregate";

export type AccountCreated = Event<"AccountCreated", Pick<AccountState, "email">, never>;
export type AccountActivated = Event<"AccountActivated", never, never>;
export type AccountAliasSet = Event<"AccountAliasSet", Pick<AccountState, "alias">, never>;
export type AccountNameSet = Event<"AccountNameSet", Pick<AccountState, "name">, never>;
export type AccountEmailSet = Event<"AccountEmailSet", Pick<AccountState, "email">, never>;
export type AccountClosed = Event<"AccountClosed", never, never>;

/*
 |--------------------------------------------------------------------------------
 | Event Exports
 |--------------------------------------------------------------------------------
 */

export type AccountEvent =
  | AccountCreated
  | AccountActivated
  | AccountAliasSet
  | AccountNameSet
  | AccountEmailSet
  | AccountClosed;
