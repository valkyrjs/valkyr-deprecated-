import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Operation, permissionOperation } from "@valkyr/access";
import { extend } from "@valkyr/utils";
import { Model } from "mongoose";

import { Role, RoleDocument } from "../Models/Role";

@Injectable()
export class PermissionService {
  constructor(@InjectModel(Role.name) private readonly model: Model<RoleDocument>) {}

  public async set(roleId: string, operations: Operation<any, any>[]) {
    if (operations.length > 0) {
      let update: Record<string, unknown> = {};
      for (const operation of operations) {
        update = permissionOperation[operation.type](update, operation as any);
      }
      await this.model.updateOne({ roleId }, update, { upsert: true });
    }
  }

  public async get<Permissions>(memberId: string): Promise<Permissions> {
    const roles = await this.model.find({ members: memberId });
    return roles.reduce((permissions, role) => extend(permissions, role.permissions), {} as Permissions);
  }
}
