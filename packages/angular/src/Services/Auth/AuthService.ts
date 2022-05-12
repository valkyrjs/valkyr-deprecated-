import { Injectable } from "@angular/core";

import { RemoteService } from "../RemoteService";
import { SocketService } from "../Socket/SocketService";
import { jwt } from "./JsonWebToken";

type Data = {
  auditor: string;
};

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(readonly remote: RemoteService, readonly socket: SocketService) {
    if (this.isAuthenticated === true) {
      socket.send("token", { token: jwt.token });
    }
  }

  get isAuthenticated(): boolean {
    return jwt.token !== null;
  }

  get details(): Data {
    if (jwt.token === null) {
      throw new Error(`Auth Violation: Cannot retrieve details for unauthenticated client`);
    }
    return jwt.decode<Data>(jwt.token);
  }

  get auditor() {
    if (this.isAuthenticated === false) {
      throw new Error("Auth Violation: Cannot retrieve auditor for unauthenticated client");
    }
    return this.details.auditor;
  }

  /**
   * Generate a single sign on token for a newly created or existing
   * account that can be used to generate a authorized signature.
   *
   * @param email - Email identifier to generate a token for.
   */
  async create(email: string) {
    return this.remote.post("/accounts", { email });
  }

  /**
   * Sign the provided email identifier using the given token.
   *
   * @param email - Email identifier to sign.
   * @param token - Single sign on token to validate the signature.
   */
  async sign(email: string, token: string) {
    await this.remote.post<{ token: string }>("/accounts/validate", { email, token }).then(({ token }) => {
      return this.resolve(token);
    });
  }

  /**
   * Authenticate the current socket by resolving the authorized JWT
   * token against the connection.
   *
   * @param token - Signed token to resolve.
   */
  async resolve(token: string) {
    await this.socket.send("token", { token });
    jwt.token = token;
  }

  /**
   * Remove the resolved authentication from the current connection.
   * This is used when you want to remove the credentials without
   * destroying the socket connection.
   */
  async destroy() {
    await this.remote.send("account:logout");
  }
}
