import { Auth } from "@valkyr/auth";

import { socket } from "../../Providers/Socket";

let auth = Auth.guest();

/**
 * Generate a single sign on token for a newly created or existing
 * account that can be used to generate a authorized signature.
 *
 * @param email - Email identifier to generate a token for.
 */
async function create(email: string) {
  return socket.send("account:create", { email });
}

/**
 * Sign the provided email identifier using the given token.
 *
 * @param email - Email identifier to sign.
 * @param token - Single sign on token to validate the signature.
 */
async function sign(email: string, token: string) {
  await socket.send("account:signature", { email, token }).then(({ token }) => {
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
  await socket.send("account:resolve", { token });
  auth = await Auth.resolve(token);
  localStorage.setItem("token", token);
}

/**
 * Remove the resolved authentication from the current connection.
 * This is used when you want to remove the credentials without
 * destroying the socket connection.
 */
async function destroy() {
  await socket.send("account:logout");
}

export { auth, create, destroy, resolve, sign };
