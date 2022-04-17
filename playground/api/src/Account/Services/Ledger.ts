import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { LedgerService } from "@valkyr/nestjs";
import { nanoid } from "@valkyr/utils";
import { Model } from "mongoose";
import { AccountStore } from "stores";

import { Account, AccountDocument } from "../Model";
import { AccountService } from "./Account";

@Injectable()
export class AccountLedgerService {
  constructor(
    @InjectModel(Account.name) private readonly model: Model<AccountDocument>,
    private readonly ledger: LedgerService,
    private readonly accounts: AccountService
  ) {}

  public async create(email: string) {
    const accountId = nanoid();

    const state = await this.ledger.reduce(accountId, AccountStore.Account);
    if (state) {
      throw new Error("Account already exists");
    }

    await this.ledger.insert(AccountStore.events.created(accountId, { email }));

    return this.accounts.getByEmail(email);
  }

  public async activate(accountId: string) {
    const state = await this.getState(accountId);
    if (state.status === "active") {
      throw new Error("Account is already active");
    }
    await this.ledger.insert(AccountStore.events.activated(accountId));
  }

  public async getState(accountId: string) {
    const state = await this.ledger.reduce(accountId, AccountStore.Account);
    if (state === undefined) {
      throw new Error("Account does not exist or has been removed");
    }
    return state;
  }
}
