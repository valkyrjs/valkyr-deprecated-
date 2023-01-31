import { api } from "~api";
import { method, UnauthorizedError } from "~services/jsonrpc";

import { AccessToken, authenticate, validateCredentials } from "../services/credentials";

api.register<AuthenticateParams, AccessToken>(
  "Authenticate",
  method(async ({ email, password }) => {
    const account = await validateCredentials(email, password);
    if (account === undefined) {
      throw new UnauthorizedError();
    }
    return authenticate(account.id);
  })
);

type AuthenticateParams = {
  email: string;
  password: string;
};
