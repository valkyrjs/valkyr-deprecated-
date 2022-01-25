import { HttpAction, WsAction } from "@valkyr/server";

/*
 |--------------------------------------------------------------------------------
 | Policies
 |--------------------------------------------------------------------------------
 */

export const isSocketAuthenticated: WsAction = async function ({ auth }) {
  if (await auth.isAuthenticated) {
    return this.accept();
  }
  return this.reject(401, "Unauthorized");
};

export const isRequestAuthenticated: HttpAction = async function ({ auth }) {
  if (await auth.isAuthenticated) {
    return this.accept();
  }
  return this.reject(401, "Unauthorized");
};
