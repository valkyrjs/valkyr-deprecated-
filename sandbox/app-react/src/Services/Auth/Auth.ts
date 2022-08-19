import { clear } from "idb-keyval";

import { realms } from "../Realms";
import { socket } from "../Socket";
import { jwt, Token } from "./Token";

/*
 |--------------------------------------------------------------------------------
 | Auth Export
 |--------------------------------------------------------------------------------
 */

export const auth = {
  /**
   * Decoded account instance for the current JWT token.
   *
   * @remarks This will throw an error if a JWT token has not been set.
   */
  get account() {
    if (jwt.token === null) {
      throw new UnauthenticatedClientError();
    }
    return jwt.decode<Auth>(jwt.token);
  },

  isAuthenticated,

  /**
   * Resolves the current token by validating its validity and sending the token
   * to the established socket.
   */
  resolve,

  /**
   * Passthrough method to set the token onto the current JWT instance.
   */
  set: setToken,

  /**
   * Passthrough method to remove the token from the current JWT instance.
   */
  destroy
};

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

function isAuthenticated(): boolean {
  try {
    // access account.
    if (auth.account) {
      return true;
    }
  } catch (error) {
    // swallow expected Error
  }
  return false;
}

async function resolve(token: string): Promise<void> {
  setToken(token);
  await jwt.validate();
  await socket.send("token", { token });
  await realms.subscribe();
}

async function destroy(): Promise<void> {
  unsetToken();
  await clear();
}

function setToken(token: string): void {
  jwt.token = token;
}

function unsetToken(): void {
  jwt.token = null;
}

/*
 |--------------------------------------------------------------------------------
 | Errors
 |--------------------------------------------------------------------------------
 */

export class UnauthenticatedClientError extends Error {
  readonly type = "UnauthenticatedClientError" as const;

  constructor() {
    super("Auth Violation: Cannot retrieve details for unauthenticated client");
  }
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Auth = {
  id: string;
} & Token;
