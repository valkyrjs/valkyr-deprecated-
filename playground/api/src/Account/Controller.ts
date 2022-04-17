import { Body, Controller, Get, Param, Post } from "@nestjs/common";
import * as jwt from "jsonwebtoken";

import { config } from "../Config";
import { AccountService } from "./Services/Account";
import { AccountLedgerService } from "./Services/Ledger";
import { TokenService } from "./Services/Token";

@Controller("/accounts")
export class AccountController {
  constructor(
    private readonly ledger: AccountLedgerService,
    private readonly account: AccountService,
    private readonly token: TokenService
  ) {}

  @Post()
  public async create(@Body("email") email: string) {
    const account = await this.resolve(email);
    if (account === null) {
      throw new Error("Could not resolve account");
    }
    await this.token.create("console", account.id);
  }

  @Post("/validate")
  public async validate(@Body("email") email: string, @Body("token") token: string) {
    const account = await this.account.getByEmail(email);
    if (account === null || (await this.token.validate(token, account.token)) === false) {
      throw new Error("Token is invalid or has expired");
    }
    if (account.status === "onboarding") {
      await this.ledger.activate(account.id);
    }
    await this.token.remove(account.id);
    return {
      token: jwt.sign(
        {
          auditor: account.id
        },
        config.auth.secret
      )
    };
  }

  @Get("/:account")
  public async getAccount(@Param("account") id: string) {
    return this.account.get(id);
  }

  private async resolve(email: string) {
    const account = await this.account.getByEmail(email);
    if (account === null) {
      return await this.ledger.create(email);
    }
    return account;
  }
}
