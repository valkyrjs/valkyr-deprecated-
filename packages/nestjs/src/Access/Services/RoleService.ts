import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Role as AccessRole, RoleData } from "@valkyr/access";
import { getId } from "@valkyr/security";
import { Model } from "mongoose";

import { Role, RoleDocument } from "../Models/Role";

@Injectable()
export class RoleService<Permissions extends AccessRole["permissions"] = AccessRole["permissions"]> {
  constructor(@InjectModel(Role.name) private readonly model: Model<RoleDocument>) {}

  public async create(role: Partial<RoleData<Permissions>>) {
    await this.model.create({
      roleId: getId(),
      ...role
    });
  }

  public async get(roleId: string) {
    return this.model.findOne({ roleId });
  }
}
