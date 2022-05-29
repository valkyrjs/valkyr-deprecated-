import { Inject, Injectable } from "@angular/core";
import { Operation, permissionOperation } from "@valkyr/access";
import { extend } from "@valkyr/utils";

import { Role, RoleModel } from "../Models/Role";

@Injectable({ providedIn: "root" })
export class PermissionService {
  constructor(@Inject(Role) readonly model: RoleModel) {}

  async set(id: string, operations: Operation<any, any>[]) {
    if (operations.length > 0) {
      let update: Record<string, unknown> = {};
      for (const operation of operations) {
        update = permissionOperation[operation.type](update, operation as any);
      }
      await this.model.updateOne({ id }, update);
    }
  }

  async get<Permissions>(memberId: string): Promise<Permissions> {
    const roles = await this.model.find({ members: memberId });
    return roles.reduce((permissions, role) => extend(permissions, role.permissions), {} as Permissions);
  }
}
