import { projection } from "@valkyr/ledger-client";
import { AccountCreated, AccountNameSet } from "stores";

import { Account } from "../Models/Account";

projection.on<AccountCreated>("AccountCreated", async ({ streamId, data: { email } }) => {
  await Account.insert({
    id: streamId,
    email
  });
});

projection.on<AccountNameSet>("AccountNameSet", async ({ streamId, data: { name } }) => {
  await Account.update({
    id: streamId,
    name
  });
});
