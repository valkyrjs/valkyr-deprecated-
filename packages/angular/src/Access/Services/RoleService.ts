import { Inject, Injectable } from "@angular/core";
import { Role as AccessRole, RoleData } from "@valkyr/access";
import { getId } from "@valkyr/security";

import { Role, RoleModel } from "../Models/Role";

@Injectable({ providedIn: "root" })
export class RoleService<Permissions extends AccessRole["permissions"] = AccessRole["permissions"]> {
  constructor(@Inject(Role) readonly model: RoleModel) {}

  async create(role: Omit<RoleData<Permissions>, "roleId">) {
    await this.model.insertOne({
      roleId: getId(),
      ...role
    });
  }

  async get(roleId: string): Promise<Role | undefined> {
    return this.model.findOne({ roleId });
  }
}
