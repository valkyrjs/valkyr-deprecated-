import { Injectable } from "@angular/core";
import { JWTPayload } from "@valkyr/security";

import { UserIdentityService } from "../../Identity";

const STORAGE_KEY = "user";

@Injectable({ providedIn: "root" })
export class AuthSessionService {
  constructor(readonly service: UserIdentityService) {}

  get isAuthenticated() {
    return this.user !== undefined;
  }

  get auditor(): string {
    const user = this.user;
    if (user === undefined) {
      throw new Error("Auth Violation: Could not retrieve auditor, session has not been resolved");
    }
    return user;
  }

  get user(): string | undefined {
    return localStorage.getItem(STORAGE_KEY) || sessionStorage.getItem(STORAGE_KEY) || undefined;
  }

  set(id: string, store: Storage = "local") {
    storage[store].setItem(STORAGE_KEY, id);
  }

  async token(payload: JWTPayload = {}, expiresAt: string | number = "30s") {
    const identity = await this.service.get(this.auditor);
    if (identity === undefined) {
      throw new Error("Session Violation: Failed to generate token, identity found for user session");
    }
    return identity.signature.sign(payload, { expiresAt });
  }
}

const storage = {
  local: localStorage,
  session: sessionStorage
};

type Storage = keyof typeof storage;
