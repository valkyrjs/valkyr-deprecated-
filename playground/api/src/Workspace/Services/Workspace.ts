import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Workspace, WorkspaceDocument } from "../Model";

@Injectable()
export class WorkspaceService {
  constructor(@InjectModel(Workspace.name) private readonly model: Model<WorkspaceDocument>) {}

  public async getByAccount(accountId: string) {
    return this.model.find({
      "members.accountId": accountId
    });
  }
}
