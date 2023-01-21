import { ServerError } from "@valkyr/jsonrpc";
import { randomUUID } from "crypto";

import { api } from "~api";
import { method } from "~services/jsonrpc";

import { findAccountByEmail } from "../data/account.collection";
import { AccessToken, hashPassword } from "../services/credentials";

api.register<CreateParams, AccessToken>(
  "CreateAccount",
  method(async ({ email, password }) => {
    const account = await findAccountByEmail(email);
    if (account !== null) {
      throw new ServerError(-32049, `Account with email '${email}' already exists`);
    }
    await api.store.push(
      randomUUID(),
      api.event.accountCreated({
        email,
        password: await hashPassword(password)
      })
    );
    return {
      token: ""
    };
  })
);

type CreateParams = {
  email: string;
  password: string;
};
