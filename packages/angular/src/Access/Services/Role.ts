import { Inject, Injectable } from "@angular/core";

import { Role, RoleModel } from "../Models/Role";

@Injectable({ providedIn: "root" })
export class RoleService {
  constructor(@Inject(Role) readonly model: RoleModel) {}

  public async get(roleId: string) {
    return this.model.findOne({ roleId });
  }
}
