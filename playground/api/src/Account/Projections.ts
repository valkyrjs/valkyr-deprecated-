import { projection } from "@valkyr/server";
import { Account, account } from "stores";

import { accounts } from "./Model";

projection.on<Account.Created>("AccountCreated", async ({ streamId, data: { email } }) => {
  await accounts.insertOne({
    id: streamId,
    status: "onboarding",
    alias: "",
    name: {
      family: "",
      given: ""
    },
    email,
    token: ""
  });
  await account.access.setup(streamId);
});

projection.on<Account.Activated>("AccountActivated", async ({ streamId }) => {
  await accounts.updateOne({ id: streamId }, { $set: { status: "active" } });
});

projection.on<Account.AliasSet>("AccountAliasSet", async ({ streamId, data: { alias } }) => {
  await accounts.updateOne({ id: streamId }, { $set: { alias } });
});

projection.on<Account.NameSet>("AccountNameSet", async ({ streamId, data: { name } }) => {
  await accounts.updateOne({ id: streamId }, { $set: { name } });
});

projection.on<Account.EmailSet>("AccountEmailSet", async ({ streamId, data: { email } }) => {
  await accounts.updateOne({ id: streamId }, { $set: { email } });
});

projection.on<Account.Closed>("AccountClosed", async ({ streamId }) => {
  await accounts.updateOne({ id: streamId }, { $set: { status: "closed" } });
});
