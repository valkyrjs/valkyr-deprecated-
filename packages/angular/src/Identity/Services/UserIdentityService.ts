import { Inject, Injectable } from "@angular/core";
import { UserIdentitySchema } from "@valkyr/identity";
import { Signature, Vault } from "@valkyr/security";

import { UserIdentity, UserIdentityModel } from "../Models/UserIdentity";

@Injectable({ providedIn: "root" })
export class UserIdentityService {
  constructor(@Inject(UserIdentity) readonly model: UserIdentityModel) {}

  async create(pid: string, data: { name: string }): Promise<UserIdentity> {
    const signature = await Signature.create();
    const vault = await Vault.create();
    return this.model.insertOne({
      pid,
      data,
      keys: {
        signature: await signature.export(),
        vault: await vault.export()
      }
    });
  }

  async insert(data: UserIdentitySchema): Promise<UserIdentity> {
    return this.model.insertOne(data);
  }

  async get(id: string): Promise<UserIdentity | undefined> {
    return this.model.findById(id);
  }

  async getByParent(pid: string): Promise<UserIdentity[]> {
    return this.model.find({ pid });
  }
}
