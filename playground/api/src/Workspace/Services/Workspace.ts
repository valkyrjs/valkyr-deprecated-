import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { AnyKeys, Model } from "mongoose";

import { Workspace, WorkspaceDocument } from "../Models/Workspace";

@Injectable()
export class WorkspaceService {
  constructor(@InjectModel(Workspace.name) private readonly model: Model<WorkspaceDocument>) {}

  public async create(doc: AnyKeys<WorkspaceDocument>) {
    return this.model.create(doc);
  }

  public async update(id: string, data: AnyKeys<WorkspaceDocument>) {
    return this.model.updateOne({ id }, data);
  }

  public async getByAccount(accountId: string) {
    return this.model.find({
      "members.accountId": accountId
    });
  }
}
