import { Injectable } from "@angular/core";
import { IdentityStorageSchema, PrivateIdentitySchema, PublicIdentityKeys, UserIdentitySchema } from "@valkyr/identity";
import { AccessKey } from "@valkyr/security";

import { RemoteService } from "../../Remote";
import { PrivateIdentity } from "../Models/PrivateIdentity";
import { UserIdentity } from "../Models/UserIdentity";
import { PrivateIdentityService } from "./PrivateIdentityService";
import { UserIdentityService } from "./UserIdentityService";

@Injectable({ providedIn: "root" })
export class IdentityStorageService {
  constructor(
    readonly privateIdentity: PrivateIdentityService,
    readonly userIdentity: UserIdentityService,
    readonly remote: RemoteService
  ) {}

  async export(id: string, access: AccessKey): Promise<void> {
    const identity = await this.privateIdentity.get(id);
    if (identity === undefined) {
      throw new Error("Identity Storage Violation: Could not export identity, not found");
    }
    const users = await this.userIdentity.getByParent(identity.id);
    await this.remote.post<IdentityStorageSchema>("/identities", {
      alias: identity.alias,
      data: access.encrypt({
        identity: await identity.export(),
        users: await Promise.all(users.map((user) => user.export()))
      }),
      keys: identity.publicKeys
    });
  }

  async import(
    alias: string,
    access: AccessKey
  ): Promise<{
    identity: PrivateIdentity;
    users: UserIdentity[];
  }> {
    const response = await this.remote.get<IdentityStorageSchema>(`/identities/${alias}`);
    const stored = access.decrypt<ImportedStorage>(response.data);
    return {
      identity: await this.#getPrivateIdentity(alias, stored.identity),
      users: await this.#getUserIdentities(stored.users)
    };
  }

  async #getPrivateIdentity(alias: string, data: PrivateIdentitySchema): Promise<PrivateIdentity> {
    const identity = await this.privateIdentity.get(data.id);
    if (identity === undefined) {
      return this.privateIdentity.insert(alias, data);
    }
    return identity;
  }

  async #getUserIdentities(users: UserIdentitySchema[]): Promise<UserIdentity[]> {
    return Promise.all(
      users.map((user) => {
        return this.userIdentity.get(user.id).then((identity) => {
          if (identity === undefined) {
            return this.userIdentity.insert(user);
          }
          return identity;
        });
      })
    );
  }
}

type ImportedStorage = {
  alias: string;
  identity: PrivateIdentitySchema;
  users: UserIdentitySchema[];
  keys: PublicIdentityKeys;
};
