import { api } from "~api";

import { access } from "../access/account.access";
import { insertAccount } from "./account.collection";

api.projector.on("AccountCreated", async ({ stream, data: { email, password } }) => {
  await Promise.all([
    access.createOwnerRole(stream),
    await insertAccount({
      id: stream,
      email,
      password
    })
  ]);
});
