import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Role, RoleDocument } from "../Models/Role";

@Injectable()
export class MemberService {
  constructor(@InjectModel(Role.name) private readonly model: Model<RoleDocument>) {}

  public async add(id: string, memberId: string) {
    await this.model.updateOne(
      { id },
      {
        $push: {
          members: memberId
        }
      }
    );
  }

  public async remove(id: string, memberId: string) {
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
