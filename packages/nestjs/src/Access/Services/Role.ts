import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Role as AccessRole, RoleData } from "@valkyr/access";
import { nanoid } from "@valkyr/utils";
import { Model } from "mongoose";

import { Role, RoleDocument } from "../Model";

@Injectable()
export class RoleService<Permissions extends AccessRole["permissions"] = AccessRole["permissions"]> {
  constructor(@InjectModel(Role.name) private readonly model: Model<RoleDocument>) {}

  public async create(role: Partial<RoleData<Permissions>>) {
    await this.model.create({
      roleId: nanoid(),
      ...role
    });
  }

  public async get(roleId: string) {
    return this.model.findOne({ roleId });
  }
}
