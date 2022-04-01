import { Auth } from "@valkyr/auth";
import * as jwt from "jsonwebtoken";
import { Account, account } from "stores";

import { config } from "../../Config";
import { hasData } from "../../Policies/hasData";
import { isSocketAuthenticated } from "../../Policies/isAuthenticated";
import { route } from "../../Providers/Server";
import { activateAccount, getAccountByEmail, getAccountByEmailOrCreate, setAccountName } from "./Services/Account";
import { createAccountToken, removeAccountToken } from "./Services/Token";

/*
 |--------------------------------------------------------------------------------
 | Create
 |--------------------------------------------------------------------------------
 |
 | Endpoint designed specifically to create a new account if one does not exist,
 | else generates a single sign on token.
 |
 | @see login
 |
 */

route.on<{ email: string }>("account:create", [
  hasData(["email"]),
  async function (_, { email }) {
    try {
      const account = await getAccountByEmailOrCreate(email);
      if (account === null) {
        return this.reject(400, "Could not retrieve account details.");
      }
      await createAccountToken("console", account.id);
      return this.resolve();
    } catch (error) {
      return this.reject(500, error.message);
    }
  }
]);

/*
 |--------------------------------------------------------------------------------
 | Login
 |--------------------------------------------------------------------------------
 |
 | We need to create a single sign on token used to authorize the user. This
 | is essentially using a third party service to verify a users credentials.
 |
 | Rather than using passwords to authenticate a user we validate their
 | credentials by providing a single sign on token to a secondary validation
 | service such as email, sms etc.
 |
 | This does not replace two factor authentication and it is recommended to add
 | this in addition to sso tokens for added security.
 |
 */

route.on<{ email: string }>("account:login", [
  hasData(["email"]),
  async function (_, { email }) {
    try {
      const account = await getAccountByEmail(email);
      if (account === null) {
        return this.reject(400, "Account does not exist.");
      }
      await createAccountToken("console", account.id);
      return this.resolve();
    } catch (error) {
      return this.reject(500, error.message);
    }
  }
]);

/*
 |--------------------------------------------------------------------------------
 | Signature
 |--------------------------------------------------------------------------------
 |
 | A single sign on token created by "create" or "login" provides a pin number
 | that is used to confirm a user identity and creates a new JWT signature the 
 | client can store and use when performing server side requests.
 |
 */

route.on<{ email: string; token: string }>("account:signature", [
  hasData(["email", "token"]),
  async function (_, { token, email }) {
    const account = await getAccountByEmail(email);

    if (account === null) {
      return this.reject(400, "Token is invalid or has expired");
    }

    if (account.token !== token) {
      return this.reject(400, "Token is invalid or has expired");
    }

    if (account.status === "onboarding") {
      await activateAccount(account.id);
    }

    await removeAccountToken(account.id);

    return this.resolve({ token: jwt.sign({ auditor: account.id }, config.auth.secret) });
  }
]);

/*
 |--------------------------------------------------------------------------------
 | Resolve
 |--------------------------------------------------------------------------------
 |
 | So that we don't have to provide a token with every web socket request we
 | persist the token for said connection by applying the "signature" to the socket
 | session.
 |
 */

route.on<{ token: string }>("account:resolve", [
  hasData(["token"]),
  async function (socket, { token }) {
    try {
      socket.auth = await Auth.resolve(token);
      socket.join(socket.auth.auditor);
    } catch (err) {
      return this.reject(400, err.message);
    }
    return this.resolve();
  }
]);

/*
 |--------------------------------------------------------------------------------
 | Permissions
 |--------------------------------------------------------------------------------
 |
 | If the client wants to do access control checks in a client browser they will
 | need to retrieve the account permissions from the server.
 |
 */

route.on<{ tenantId: string }>("account:permissions", [
  isSocketAuthenticated,
  hasData(["tenantId"]),
  async function (socket) {
    return this.resolve(await account.access.permissions(socket.auth.auditor));
  }
]);

/*
 |--------------------------------------------------------------------------------
 | Logout
 |--------------------------------------------------------------------------------
 |
 | If a client wants to destroy their authenticated state without dropping the
 | socket connection we need a way to be able to handle this requirement.
 |
 */

route.on("account:logout", [
  async function (socket) {
    if (socket.auth.isAuthenticated) {
      socket.leave(socket.auth.auditor);
      socket.auth = await Auth.guest();
    }
    return this.resolve();
  }
]);

/*
 |--------------------------------------------------------------------------------
 | Name
 |--------------------------------------------------------------------------------
 */

route.on<{ name: Account.State["name"] }>("account:setName", [
  isSocketAuthenticated,
  hasData(["name"]),
  async function (socket, { name }) {
    try {
      const auditor = socket.auth.auditor;
      const permission = await account.access.for("account", auditor).can("setName");
      if (permission.granted === false) {
        return this.reject(403, permission.message);
      }
      await setAccountName(auditor, name);
      return this.resolve();
    } catch (error) {
      return this.reject(500, error.message);
    }
  }
]);
