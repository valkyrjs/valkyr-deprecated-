import { jwt } from "./Jwt";
import { remote } from "./Remote";

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

type Status = "authenticated" | "unauthenticated";

type Data = {
  auditor: string;
};

/*
 |--------------------------------------------------------------------------------
 | Auth
 |--------------------------------------------------------------------------------
 */

export const auth = {
  get status(): Status {
    if (jwt.token === null) {
      return "unauthenticated";
    }
    return "authenticated";
  },

  get details(): Data {
    if (jwt.token === null) {
      throw new Error(`Auth Violation: Cannot retrieve details for unauthenticated client`);
    }
    return jwt.decode<Data>(jwt.token);
  },

  get auditor() {
    return auth.details.auditor;
  },

  is(status: Status): boolean {
    return status === auth.status;
  },

  setup,
  create,
  sign,
  resolve,
  destroy
};

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

async function setup() {
  if (auth.is("authenticated")) {
    await remote.socket.send("account:resolve", { token: jwt.token });
  }
}

/**
 * Generate a single sign on token for a newly created or existing
 * account that can be used to generate a authorized signature.
 *
 * @param email - Email identifier to generate a token for.
 */
async function create(email: string) {
  return remote.socket.send("account:create", { email });
}

/**
 * Sign the provided email identifier using the given token.
 *
 * @param email - Email identifier to sign.
 * @param token - Single sign on token to validate the signature.
 */
async function sign(email: string, token: string) {
  await remote.socket.send("account:signature", { email, token }).then(({ token }) => {
    return resolve(token);
  });
}

/**
 * Authenticate the current socket by resolving the authorized JWT
 * token against the connection.
 *
 * @param token - Signed token to resolve.
 */
async function resolve(token: string) {
  await remote.socket.send("account:resolve", { token });
  jwt.token = token;
}

/**
 * Remove the resolved authentication from the current connection.
 * This is used when you want to remove the credentials without
 * destroying the socket connection.
 */
async function destroy() {
  await remote.socket.send("account:logout");
}
