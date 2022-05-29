import { Inject, Injectable } from "@angular/core";

import { Role, RoleModel } from "../Models/Role";

@Injectable({ providedIn: "root" })
export class MemberService {
  constructor(@Inject(Role) readonly model: RoleModel) {}

  async add(id: string, memberId: string) {
    await this.model.updateOne(
      { id },
      {
        $push: {
          members: memberId
        }
      }
    );
  }

  async remove(id: string, memberId: string) {
    await this.model.updateOne(
      { id },
      {
        $pull: {
          members: memberId
        }
      }
    );
  }
}
