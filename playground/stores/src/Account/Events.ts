import { createEvent, Event } from "@valkyr/ledger";

import { AccountState } from "./Aggregate";

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export const events = {
  created: createEvent<AccountCreated>("AccountCreated"),
  activated: createEvent<AccountActivated>("AccountActivated"),
  aliasSet: createEvent<AccountAliasSet>("AccountAliasSet"),
  nameSet: createEvent<AccountNameSet>("AccountNameSet"),
  emailSet: createEvent<AccountEmailSet>("AccountEmailSet"),
  closed: createEvent<AccountClosed>("AccountClosed")
};

/*
 |--------------------------------------------------------------------------------
 | Events Types
 |--------------------------------------------------------------------------------
 */

export type AccountCreated = Event<"AccountCreated", Pick<AccountState, "email">, never>;
export type AccountActivated = Event<"AccountActivated", never, never>;
export type AccountAliasSet = Event<"AccountAliasSet", Pick<AccountState, "alias">, never>;
export type AccountNameSet = Event<"AccountNameSet", Pick<AccountState, "name">, never>;
export type AccountEmailSet = Event<"AccountEmailSet", Pick<AccountState, "email">, never>;
export type AccountClosed = Event<"AccountClosed", never, never>;

/*
 |--------------------------------------------------------------------------------
 | Events Union
 |--------------------------------------------------------------------------------
 */

export type AccountEvent =
  | AccountCreated
  | AccountActivated
  | AccountAliasSet
  | AccountNameSet
  | AccountEmailSet
  | AccountClosed;
