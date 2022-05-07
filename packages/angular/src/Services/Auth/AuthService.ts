import { Injectable } from "@angular/core";

import { RemoteService } from "../RemoteService";
import { SocketService } from "../Socket/SocketService";
import { jwt } from "./JsonWebToken";

type Data = {
  auditor: string;
};

@Injectable({
  providedIn: "root"
})
export class AuthService {
  constructor(private readonly remote: RemoteService, private socket: SocketService) {
    if (this.isAuthenticated === true) {
      socket.send("token", { token: jwt.token });
    }
  }

  public get isAuthenticated(): boolean {
    return jwt.token !== null;
  }

  public get details(): Data {
    if (jwt.token === null) {
      throw new Error(`Auth Violation: Cannot retrieve details for unauthenticated client`);
    }
    return jwt.decode<Data>(jwt.token);
  }

  public get auditor() {
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
  public async create(email: string) {
    return this.remote.post("/accounts", { email });
  }

  /**
   * Sign the provided email identifier using the given token.
   *
   * @param email - Email identifier to sign.
   * @param token - Single sign on token to validate the signature.
   */
  public async sign(email: string, token: string) {
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
  public async resolve(token: string) {
    await this.socket.send("token", { token });
    jwt.token = token;
  }

  /**
   * Remove the resolved authentication from the current connection.
   * This is used when you want to remove the credentials without
   * destroying the socket connection.
   */
  public async destroy() {
    await this.remote.send("account:logout");
  }
}