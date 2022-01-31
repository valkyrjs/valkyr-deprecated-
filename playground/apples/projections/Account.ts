import { projection } from "@valkyr/ledger";
import { AccountCreated } from "stores";

import { collection } from "../Collections";

projection.on<AccountCreated>("AccountCreated", async ({ entityId, data: { email } }) => {
  await collection.accounts.insert({
    id: entityId,
    email
  });
});
