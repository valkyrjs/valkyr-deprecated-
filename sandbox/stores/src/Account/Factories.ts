import { createEvent } from "@valkyr/event-store";

import type { AccountActivated, AccountAliasSet, AccountClosed, AccountCreated, AccountEmailSet, AccountNameSet } from "./Events";

export const account = {
  created: createEvent<AccountCreated>("AccountCreated"),
  activated: createEvent<AccountActivated>("AccountActivated"),
  aliasSet: createEvent<AccountAliasSet>("AccountAliasSet"),
  nameSet: createEvent<AccountNameSet>("AccountNameSet"),
  emailSet: createEvent<AccountEmailSet>("AccountEmailSet"),
  closed: createEvent<AccountClosed>("AccountClosed")
};
