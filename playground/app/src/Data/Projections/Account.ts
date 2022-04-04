import { ledger } from "@valkyr/client";
import { Account as Acct } from "stores";

import { Account } from "../Models/Account";

ledger.projection.on<Acct.Created>("AccountCreated", async ({ streamId, data: { email } }) => {
  await Account.insert({
    id: streamId,
    email
  });
});

ledger.projection.on<Acct.NameSet>("AccountNameSet", async ({ streamId, data: { name } }) => {
  await Account.update({
    id: streamId,
    name
  });
});
