import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { nanoid } from "@valkyr/utils";
import { AnyKeys, Model } from "mongoose";

import { Role, RoleDocument } from "../Model";

@Injectable()
export class RoleService {
  constructor(@InjectModel(Role.name) private readonly model: Model<RoleDocument>) {}

  public async create(role: AnyKeys<RoleDocument>) {
    await this.model.create({
      roleId: nanoid(),
      ...role
    });
  }

  public async get(roleId: string) {
    return this.model.findOne({ roleId });
  }
}
