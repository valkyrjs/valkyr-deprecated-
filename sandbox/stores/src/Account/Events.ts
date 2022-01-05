import type { EventBase } from "@valkyr/event-store";

import type { Account } from "./Aggregate";

export type AccountCreated = EventBase<"AccountCreated", Pick<Account, "email">, never>;
export type AccountActivated = EventBase<"AccountActivated", never, never>;
export type AccountAliasSet = EventBase<"AccountAliasSet", Pick<Account, "alias">, never>;
export type AccountNameSet = EventBase<"AccountNameSet", Pick<Account, "name">, never>;
export type AccountEmailSet = EventBase<"AccountEmailSet", Pick<Account, "email">, never>;
export type AccountClosed = EventBase<"AccountClosed", never, never>;
