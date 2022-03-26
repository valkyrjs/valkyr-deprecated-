export * from "./Aggregate";

import { createEvent } from "@valkyr/ledger";

import { access } from "./Access";
import {
  AccountActivated,
  AccountAliasSet,
  AccountClosed,
  AccountCreated,
  AccountEmailSet,
  AccountEvent,
  AccountNameSet
} from "./Events";

export const account = {
  access,
  created: createEvent<AccountCreated>("AccountCreated"),
  activated: createEvent<AccountActivated>("AccountActivated"),
  aliasSet: createEvent<AccountAliasSet>("AccountAliasSet"),
  nameSet: createEvent<AccountNameSet>("AccountNameSet"),
  emailSet: createEvent<AccountEmailSet>("AccountEmailSet"),
  closed: createEvent<AccountClosed>("AccountClosed")
};

export {
  AccountActivated,
  AccountAliasSet,
  AccountClosed,
  AccountCreated,
  AccountEmailSet,
  AccountEvent,
  AccountNameSet
};
