// import { ledger } from "@valkyr/client";
// import { AccountStore } from "stores";

// import { Account } from "./Model";

// ledger.projection.on<AccountStore.Created>("AccountCreated", async ({ streamId, data: { email } }) => {
//   await Account.insert({
//     id: streamId,
//     email
//   });
// });

// ledger.projection.on<AccountStore.NameSet>("AccountNameSet", async ({ streamId, data: { name } }) => {
//   await Account.update({
//     id: streamId,
//     name
//   });
// });
