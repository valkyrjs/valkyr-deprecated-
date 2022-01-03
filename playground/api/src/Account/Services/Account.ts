import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { AnyKeys, Model } from "mongoose";

import { Account, AccountDocument } from "../Model";

@Injectable()
export class AccountService {
  constructor(@InjectModel(Account.name) private readonly model: Model<AccountDocument>) {}

  public async create(doc: AnyKeys<AccountDocument>) {
    return this.model.create(doc);
  }

  public async update(id: string, data: AnyKeys<AccountDocument>) {
    return this.model.updateOne({ id }, data);
  }

  public async get(id: string) {
    return this.model.findOne({ id });
  }

  public async getByEmail(email: string) {
    return this.model.findOne({ email });
  }
}
