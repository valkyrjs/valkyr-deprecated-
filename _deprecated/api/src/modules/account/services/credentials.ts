import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { config } from "../../../config";
import { Account, findAccountByEmail } from "../account.collection";

/**
 * Authenticate an account by its id and return a JWT token.
 *
 * @param id - Account id to authenticate.
 */
export function authenticate(id: string): AccessToken {
  return {
    token: jwt.sign({ id }, config.auth.secret)
  };
}

/**
 * Validate credentials and return the account if valid.
 *
 * @param email    - Account email.
 * @param password - Account password.
 */
export async function validateCredentials(email: string, password: string): Promise<Account | undefined> {
  const account = await findAccountByEmail(email);
  if (account === null) {
    return undefined;
  }
  const valid = await bcrypt.compare(password, account.password);
  if (!valid) {
    return undefined;
  }
  return account;
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type AccessToken = {
  token: string;
};
