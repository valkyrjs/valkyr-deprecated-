import { Inject, Injectable } from "@angular/core";
import { PrivateIdentitySchema } from "@valkyr/identity";
import { Signature, Vault } from "@valkyr/security";

import { PrivateIdentity, PrivateIdentityModel } from "../Models/PrivateIdentity";

@Injectable({ providedIn: "root" })
export class PrivateIdentityService {
  constructor(@Inject(PrivateIdentity) readonly model: PrivateIdentityModel) {}

  async create(alias: string): Promise<PrivateIdentity> {
    const signature = await Signature.create();
    const vault = await Vault.create();
    return this.model.insertOne({
      alias,
      data: {},
      keys: {
        signature: await signature.export(),
        vault: await vault.export()
      }
    });
  }

  async insert(alias: string, data: PrivateIdentitySchema): Promise<PrivateIdentity> {
    return this.model.insertOne({
      alias,
      ...data
    });
  }

  async get(id: string): Promise<PrivateIdentity | undefined> {
    return this.model.findById(id);
  }
}
