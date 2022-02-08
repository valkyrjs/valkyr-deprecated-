import { projection } from "@valkyr/ledger";
import { AccountCreated } from "stores";

import { collection } from "../Collections";

projection.on<AccountCreated>("AccountCreated", async ({ streamId, data: { email } }) => {
  await collection.accounts.insert({
    id: streamId,
    email
  });
});
