import { container } from "@valkyr/access";
import { Auth } from "@valkyr/auth";
import type { WsAction } from "@valkyr/server";
import * as jwt from "jsonwebtoken";

import { config } from "../../Config";
import * as accountService from "./Account.Service";
import * as tokenService from "./Token.Service";

/*
 |--------------------------------------------------------------------------------
 | Create
 |--------------------------------------------------------------------------------
 */

export const create: WsAction<{ email: string }> = async function (_, { email }) {
  try {
    const account = await accountService.getByEmailOrCreate(email);
    if (!account) {
      return this.reject(400, "Failed to retrieve account id");
    }
    await tokenService.create("console", account.accountId);
    return this.resolve();
  } catch (error) {
    return this.reject(500, error.message);
  }
};

/*
 |--------------------------------------------------------------------------------
 | Login
 |--------------------------------------------------------------------------------
 */

export const login: WsAction<{ email: string; token: string }> = async function (_, { token, email }) {
  const account = await accountService.getByEmail(email);

  if (!account) {
    return this.reject(400, "Token is invalid or has expired");
  }

  if (account.token !== token) {
    return this.reject(400, "Token is invalid or has expired");
  }

  if (account.status === "onboarding") {
    await accountService.activate(account.accountId);
  }

  await tokenService.remove(account.accountId);

  return this.resolve({ token: jwt.sign({ auditor: account.accountId }, config.auth.secret) });
};

/*
 |--------------------------------------------------------------------------------
 | Resolve
 |--------------------------------------------------------------------------------
 */

export const resolve: WsAction<{ token: string }> = async function (socket, { token }) {
  try {
    socket.auth = await Auth.resolve(token);
  } catch (err) {
    return this.reject(400, err.message);
  }
  return this.resolve();
};

/*
 |--------------------------------------------------------------------------------
 | Permissions
 |--------------------------------------------------------------------------------
 */

export const permissions: WsAction = async function (socket, { tenantId }) {
  return this.resolve(await container.get("Database").getPermissions(tenantId, socket.auth.auditor));
};

/*
 |--------------------------------------------------------------------------------
 | Destroy
 |--------------------------------------------------------------------------------
 */

export const destroy: WsAction = async function (socket) {
  socket.auth = await Auth.guest();
  return this.resolve();
};
