import { createEvent, Event as LedgerEvent } from "@valkyr/ledger";

import { State } from "./Aggregate";

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export const events = {
  created: createEvent<Created>("AccountCreated"),
  activated: createEvent<Activated>("AccountActivated"),
  aliasSet: createEvent<AliasSet>("AccountAliasSet"),
  nameSet: createEvent<NameSet>("AccountNameSet"),
  emailSet: createEvent<EmailSet>("AccountEmailSet"),
  closed: createEvent<Closed>("AccountClosed")
};

/*
 |--------------------------------------------------------------------------------
 | Events Types
 |--------------------------------------------------------------------------------
 */

export type Created = LedgerEvent<"AccountCreated", Pick<State, "email">, never>;
export type Activated = LedgerEvent<"AccountActivated", never, never>;
export type AliasSet = LedgerEvent<"AccountAliasSet", Pick<State, "alias">, never>;
export type NameSet = LedgerEvent<"AccountNameSet", Pick<State, "name">, never>;
export type EmailSet = LedgerEvent<"AccountEmailSet", Pick<State, "email">, never>;
export type Closed = LedgerEvent<"AccountClosed", never, never>;

/*
 |--------------------------------------------------------------------------------
 | Events Union
 |--------------------------------------------------------------------------------
 */

export type Event = Created | Activated | AliasSet | NameSet | EmailSet | Closed;
