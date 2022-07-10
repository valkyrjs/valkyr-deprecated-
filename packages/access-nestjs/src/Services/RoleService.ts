import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Role as AccessRole, RoleSettings } from "@valkyr/access";
import { Model } from "mongoose";

import { Role, RoleDocument } from "../Models/Role";

@Injectable()
export class RoleService<Permissions extends AccessRole["permissions"] = AccessRole["permissions"]> {
  constructor(@InjectModel(Role.name) private readonly model: Model<RoleDocument>) {}

  public async create(role: RoleSettings<Permissions>) {
    await this.model.create(role);
  }

  public async get(id: string) {
    return this.model.findOne({ id });
  }
}
