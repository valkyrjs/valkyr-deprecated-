import { ServerError } from "@valkyr/jsonrpc";

import { Action } from "~services/jsonrpc";

export const isAuthenticated: Action = async function (_, { headers: { authorization } }) {
  if (authorization === undefined) {
    return this.reject(new ServerError(-32000, "Unauthorized"));
  }
  return this.accept();
};
