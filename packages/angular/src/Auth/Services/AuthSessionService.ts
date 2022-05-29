import { Injectable } from "@angular/core";
import { AccessKey, JWTPayload } from "@valkyr/security";

import { PrivateIdentity, PrivateIdentityService, UserIdentity, UserIdentityService } from "../../Identity";

const IDENTITY_STORAGE_KEY = "auth:identity";
const USER_STORAGE_KEY = "auth:user";
const ACCESS_KEY_STORAGE = "auth:access";

@Injectable({ providedIn: "root" })
export class AuthSessionService {
  constructor(readonly privateIdentity: PrivateIdentityService, readonly userIdentity: UserIdentityService) {}

  get isAuthenticated() {
    return (
      getStorageItem(IDENTITY_STORAGE_KEY) !== undefined &&
      getStorageItem(USER_STORAGE_KEY) !== undefined &&
      getStorageItem(ACCESS_KEY_STORAGE) !== undefined
    );
  }

  get identity(): string {
    const identity = getStorageItem(IDENTITY_STORAGE_KEY);
    if (identity === undefined) {
      throw new Error("Auth Violation: Could not retrieve identity, session has not been resolved");
    }
    return identity;
  }

  get user(): string {
    const user = getStorageItem(USER_STORAGE_KEY);
    if (user === undefined) {
      throw new Error("Auth Violation: Could not retrieve user, session has not been resolved");
    }
    return user;
  }

  get access(): AccessKey {
    const access = getStorageItem(ACCESS_KEY_STORAGE);
    if (access === undefined) {
      throw new Error("Auth Violation: Could not retrieve access key, session has not been resolved");
    }
    return new AccessKey(access);
  }

  setIdentity(id: string, store: Storage = "local"): void {
    storage[store].setItem(IDENTITY_STORAGE_KEY, id);
  }

  setUser(id: string, store: Storage = "local") {
    storage[store].setItem(USER_STORAGE_KEY, id);
  }

  setAccess(access: AccessKey, store: Storage = "local") {
    storage[store].setItem(ACCESS_KEY_STORAGE, access.value);
  }

  async getIdentity(): Promise<PrivateIdentity> {
    const id = this.identity;
    if (id === undefined) {
      throw new Error("Auth Violation: Could not retrieve identity id, session has not been resolved");
    }
    const identity = await this.privateIdentity.get(id);
    if (identity === undefined) {
      throw new Error("Auth Violation: Failed to get identity, not found");
    }
    return identity;
  }

  async getUser(): Promise<UserIdentity> {
    const user = await this.userIdentity.get(this.user);
    if (user === undefined) {
      throw new Error("Auth Violation: Failed to get user, not found");
    }
    return user;
  }

  async getSignedToken(payload: JWTPayload = {}, expiresAt: string | number = "30s") {
    const user = await this.getUser();
    return user.signature.sign(payload, { expiresAt });
  }
}

const storage = {
  local: localStorage,
  session: sessionStorage
};

function getStorageItem(key: string): string | undefined {
  return localStorage.getItem(key) || sessionStorage.getItem(key) || undefined;
}

type Storage = keyof typeof storage;
