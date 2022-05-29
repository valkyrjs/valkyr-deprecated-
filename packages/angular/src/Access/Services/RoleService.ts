import { Inject, Injectable } from "@angular/core";
import { Role as AccessRole, RoleSettings } from "@valkyr/access";

import { Role, RoleModel } from "../Models/Role";

@Injectable({ providedIn: "root" })
export class RoleService<Permissions extends AccessRole["permissions"] = AccessRole["permissions"]> {
  constructor(@Inject(Role) readonly model: RoleModel) {}

  async create(role: RoleSettings<Permissions>) {
    await this.model.insertOne(role);
  }

  async get(id: string): Promise<Role | undefined> {
    return this.model.findOne({ id });
  }
}
