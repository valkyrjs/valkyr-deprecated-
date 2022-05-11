import { Inject, Injectable } from "@angular/core";

import { Role, RoleModel } from "../Models/Role";

@Injectable({ providedIn: "root" })
export class MemberService {
  constructor(@Inject(Role) readonly model: RoleModel) {}

  async add(roleId: string, memberId: string) {
    await this.model.updateOne(
      { roleId },
      {
        $push: {
          members: memberId
        }
      }
    );
  }

  async remove(roleId: string, memberId: string) {
    await this.model.updateOne(
      { roleId },
      {
        $pull: {
          members: memberId
        }
      }
    );
  }
}
