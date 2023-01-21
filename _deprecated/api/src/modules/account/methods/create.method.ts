import { ServerError } from "@valkyr/jsonrpc";
import { randomUUID } from "crypto";

import { method } from "../../../services/jsonrpc";
import { ledger } from "../../ledger/ledger";
import { findAccountByEmail } from "../account.collection";
import { AccessToken } from "../services/credentials";
import { accountCreated } from "../store";

export const createAccount = method<CreateParams, AccessToken>(async ({ email, password }) => {
  const account = await findAccountByEmail(email);
  if (account !== null) {
    throw new ServerError(-32049, `Account with email '${email}' already exists`);
  }
  await ledger.push(randomUUID(), accountCreated({ email, password }));
  return {
    token: ""
  };
});

type CreateParams = {
  email: string;
  password: string;
};
