import { Ledger } from "@valkyr/ledger";

import { State } from "./Aggregate";

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

export const events = {
  created: Ledger.createEvent<Created>("AccountCreated"),
  activated: Ledger.createEvent<Activated>("AccountActivated"),
  aliasSet: Ledger.createEvent<AliasSet>("AccountAliasSet"),
  nameSet: Ledger.createEvent<NameSet>("AccountNameSet"),
  emailSet: Ledger.createEvent<EmailSet>("AccountEmailSet"),
  closed: Ledger.createEvent<Closed>("AccountClosed")
};

/*
 |--------------------------------------------------------------------------------
 | Events Types
 |--------------------------------------------------------------------------------
 */

export type Created = Ledger.Event<"AccountCreated", Pick<State, "email">, never>;
export type Activated = Ledger.Event<"AccountActivated", never, never>;
export type AliasSet = Ledger.Event<"AccountAliasSet", Pick<State, "alias">, never>;
export type NameSet = Ledger.Event<"AccountNameSet", Pick<State, "name">, never>;
export type EmailSet = Ledger.Event<"AccountEmailSet", Pick<State, "email">, never>;
export type Closed = Ledger.Event<"AccountClosed", never, never>;

/*
 |--------------------------------------------------------------------------------
 | Events Union
 |--------------------------------------------------------------------------------
 */

export type Event = Created | Activated | AliasSet | NameSet | EmailSet | Closed;
