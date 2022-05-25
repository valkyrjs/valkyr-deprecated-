import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { PublicIdentityKeys } from "@valkyr/identity";
import { Model } from "mongoose";

import { Identity, IdentityDocument } from "../Models/Identity";

@Injectable()
export class IdentityService {
  constructor(@InjectModel(Identity.name) readonly model: Model<IdentityDocument>) {}

  async create(alias: string, data: string, keys: PublicIdentityKeys): Promise<void> {
    await this.model.create({ alias, data, signature: keys.signature, vault: keys.vault });
  }

  async set(alias: string, data: string): Promise<void> {
    await this.model.updateOne({ alias }, { data });
  }

  async get(alias: string): Promise<Identity | null> {
    return this.model.findOne({ alias });
  }
}
