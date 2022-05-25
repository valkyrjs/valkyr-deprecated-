import { Injectable } from "@angular/core";
import { AccessKey } from "@valkyr/security";

import { UserIdentity, UserIdentityService } from "../../Identity";
import { RemoteService } from "../../Remote";
import { RemoteIdentityResponse } from "../Types";
import { AuthSessionService } from "./AuthSessionService";

@Injectable({ providedIn: "root" })
export class AuthService {
  constructor(
    readonly remote: RemoteService,
    readonly session: AuthSessionService,
    readonly user: UserIdentityService
  ) {}

  get isAuthenticated() {
    return this.session.isAuthenticated;
  }

  get auditor() {
    return this.session.auditor;
  }

  get set() {
    return this.session.set;
  }

  async authenticate(alias: string, password: string, secret: string): Promise<void> {
    const response = await this.remote.get<RemoteIdentityResponse>(`/identities/${alias}`);
    const data = AccessKey.resolve(password, secret).decrypt(response.identity);
    console.log(data);
  }

  async getUser(): Promise<UserIdentity> {
    const user = await this.user.get(this.auditor);
    if (user === undefined) {
      throw new Error("Auth Violation: Failed to get user, not found");
    }
    return user;
  }
}
