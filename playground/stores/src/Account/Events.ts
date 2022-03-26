import { Event } from "@valkyr/ledger";

import { Account } from "./Aggregate";

export type AccountEvent =
  | AccountCreated
  | AccountActivated
  | AccountAliasSet
  | AccountNameSet
  | AccountEmailSet
  | AccountClosed;

export type AccountCreated = Event<"AccountCreated", Pick<Account, "email">, never>;
export type AccountActivated = Event<"AccountActivated", never, never>;
export type AccountAliasSet = Event<"AccountAliasSet", Pick<Account, "alias">, never>;
export type AccountNameSet = Event<"AccountNameSet", Pick<Account, "name">, never>;
export type AccountEmailSet = Event<"AccountEmailSet", Pick<Account, "email">, never>;
export type AccountClosed = Event<"AccountClosed", never, never>;
