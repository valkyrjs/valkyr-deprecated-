import { createEvent, Event } from "@valkyr/ledger";

import type { Account } from "./Aggregate";

export type AccountCreated = Event<"AccountCreated", Pick<Account, "email">, never>;
export type AccountActivated = Event<"AccountActivated", never, never>;
export type AccountAliasSet = Event<"AccountAliasSet", Pick<Account, "alias">, never>;
export type AccountNameSet = Event<"AccountNameSet", Pick<Account, "name">, never>;
export type AccountEmailSet = Event<"AccountEmailSet", Pick<Account, "email">, never>;
export type AccountClosed = Event<"AccountClosed", never, never>;

export const events = {
  created: createEvent<AccountCreated>("AccountCreated"),
  activated: createEvent<AccountActivated>("AccountActivated"),
  aliasSet: createEvent<AccountAliasSet>("AccountAliasSet"),
  nameSet: createEvent<AccountNameSet>("AccountNameSet"),
  emailSet: createEvent<AccountEmailSet>("AccountEmailSet"),
  closed: createEvent<AccountClosed>("AccountClosed")
};
