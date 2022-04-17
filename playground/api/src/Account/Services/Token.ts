import { Injectable } from "@nestjs/common";
import { customAlphabet } from "@valkyr/utils";
import * as bcrypt from "bcrypt";

import { AccountService } from "./Account";

const generateToken = customAlphabet("1234567890", 6);

@Injectable()
export class TokenService {
  constructor(private readonly accounts: AccountService) {}

  public async create(type: "email" | "sms" | "console", accountId: string) {
    const token = generateToken();
    await this.accounts.update(accountId, { token: await bcrypt.hash(token, 10) });
    switch (type) {
      case "email": {
        throw new Error("Email is not yet supported");
      }
      case "sms": {
        throw new Error("SMS is not yet supported");
      }
      case "console": {
        console.log("Token:", token);
        break;
      }
    }
    return token;
  }

  public async validate(token: string, encrypted?: string) {
    if (encrypted === undefined) {
      return false;
    }
    return bcrypt.compare(token, encrypted);
  }

  public async remove(accountId: string) {
    await this.accounts.update(accountId, { token: "" });
  }
}
