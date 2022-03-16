import { projection } from "@valkyr/ledger";
import { AccountCreated, AccountNameSet } from "stores";

import { collection } from "../Collections";

projection.on<AccountCreated>("AccountCreated", async ({ streamId, data: { email } }) => {
  await collection.accounts.insert({
    id: streamId,
    email
  });
});

projection.on<AccountNameSet>("AccountNameSet", async ({ streamId, data: { name } }) => {
  await collection.accounts.update({
    id: streamId,
    name
  });
});
