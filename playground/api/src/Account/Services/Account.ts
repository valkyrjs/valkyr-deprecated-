import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";

import { Account, AccountDocument } from "../Model";

@Injectable()
export class AccountService {
  constructor(@InjectModel(Account.name) private readonly model: Model<AccountDocument>) {}

  public async insert(id: string, email: string) {
    return this.model.create({
      id,
      status: "onboarding",
      alias: "",
      name: {
        family: "",
        given: ""
      },
      email,
      token: ""
    });
  }

  public async update(id: string, data: Partial<AccountDocument>) {
    return this.model.updateOne({ id }, data);
  }

  public async get(id: string) {
    return this.model.findOne({ id });
  }

  public async getByEmail(email: string) {
    return this.model.findOne({ email });
  }
}
