import { container } from "@valkyr/access";
import { Auth } from "@valkyr/auth";
import type { WsAction } from "@valkyr/server";
import * as jwt from "jsonwebtoken";
import { access, Account } from "stores";

import { config } from "../../Config";
import { service } from "./Services";

/*
 |--------------------------------------------------------------------------------
 | Create
 |--------------------------------------------------------------------------------
 */

export const create: WsAction<{ email: string }> = async function (_, { email }) {
  try {
    const account = await service.account.getByEmailOrCreate(email);
    if (!account) {
      return this.reject(400, "Failed to retrieve account id");
    }
    await service.token.create("console", account.accountId);
    return this.resolve();
  } catch (error) {
    return this.reject(500, error.message);
  }
};

export const setName: WsAction<{ name: Account["name"] }> = async function (socket, { name }) {
  try {
    const auditor = socket.auth.auditor;
    const permission = await access.account.for(auditor, auditor).can("setName", "account");
    if (permission.granted === false) {
      return this.reject(503, permission.message);
    }
    await service.account.name(auditor, name);
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
  const account = await service.account.getByEmail(email);

  if (!account) {
    return this.reject(400, "Token is invalid or has expired");
  }

  if (account.token !== token) {
    return this.reject(400, "Token is invalid or has expired");
  }

  if (account.status === "onboarding") {
    await service.account.activate(account.accountId);
  }

  await service.token.remove(account.accountId);

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
