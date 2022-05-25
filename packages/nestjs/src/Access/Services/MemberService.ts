import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Role, RoleDocument } from "../Models/Role";

@Injectable()
export class MemberService {
  constructor(@InjectModel(Role.name) private readonly model: Model<RoleDocument>) {}

  public async add(roleId: string, memberId: string) {
    await this.model.updateOne(
      { roleId },
      {
        $push: {
          members: memberId
        }
      }
    );
  }

  public async remove(roleId: string, memberId: string) {
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
