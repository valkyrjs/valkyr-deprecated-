import { Event } from "@valkyr/ledger";

import { Account } from "./Aggregate";

/*
 |--------------------------------------------------------------------------------
 | Account Creation
 |--------------------------------------------------------------------------------
 */

export type AccountCreated = Event<
  "AccountCreated",
  {
    email: Account["email"];
  },
  never
>;

/*
 |--------------------------------------------------------------------------------
 | Account Status
 |--------------------------------------------------------------------------------
 */

export type AccountActivated = Event<"AccountActivated", never, never>;

/*
 |--------------------------------------------------------------------------------
 | Account Alias
 |--------------------------------------------------------------------------------
 */

export type AccountAliasSet = Event<
  "AccountAliasSet",
  {
    alias: Account["alias"];
  },
  never
>;

/*
 |--------------------------------------------------------------------------------
 | Account Name
 |--------------------------------------------------------------------------------
 */

export type AccountNameSet = Event<
  "AccountNameSet",
  {
    name: Account["name"];
  },
  never
>;

/*
 |--------------------------------------------------------------------------------
 | Account Email
 |--------------------------------------------------------------------------------
 */

export type AccountEmailSet = Event<
  "AccountEmailSet",
  {
    email: Account["email"];
  },
  never
>;

/*
 |--------------------------------------------------------------------------------
 | Account Closure
 |--------------------------------------------------------------------------------
 */

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
