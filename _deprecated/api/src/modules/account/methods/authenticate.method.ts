import { method, UnauthorizedError } from "../../../services/jsonrpc";
import { AccessToken, authenticate, validateCredentials } from "../services/credentials";

export const authenticateAccount = method<AuthenticateParams, AccessToken>(async ({ email, password }) => {
  const account = await validateCredentials(email, password);
  if (account === undefined) {
    throw new UnauthorizedError();
  }
  return authenticate(account.id);
});

type AuthenticateParams = {
  email: string;
  password: string;
};
