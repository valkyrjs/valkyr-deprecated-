import { ledger } from "../ledger/ledger";
import { access } from "./account.access";
import { insertAccount } from "./account.collection";
import { AccountCreated } from "./store";

ledger.projector.on<AccountCreated>("AccountCreated", async ({ stream, data: { email, password } }) => {
  await Promise.all([
    access.createOwnerRole(stream),
    await insertAccount({
      id: stream,
      email,
      password
    })
  ]);
});
