import { Injectable } from "@angular/core";
import { AccessKey } from "@valkyr/security";

import { PrivateIdentityService, UserIdentityService } from "../../Identity";
import { RemoteService } from "../../Remote";
import { RemoteIdentityResponse } from "../Types";
import { AuthSessionService } from "./AuthSessionService";

@Injectable({ providedIn: "root" })
export class AuthService extends AuthSessionService {
  constructor(
    readonly remote: RemoteService,
    readonly session: AuthSessionService,
    readonly privateIdentity: PrivateIdentityService,
    readonly userIdentity: UserIdentityService
  ) {
    super(privateIdentity, userIdentity);
  }

  async authenticate(alias: string, password: string, secret: string): Promise<void> {
    const response = await this.remote.get<RemoteIdentityResponse>(`/identities/${alias}`);
    const data = AccessKey.resolve(password, secret).decrypt(response.identity);
    console.log(data);
  }
}
