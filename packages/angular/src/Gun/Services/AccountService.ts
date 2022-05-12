import { Injectable } from "@angular/core";
import { nanoid } from "@valkyr/utils";

import { create, put } from "../Utils";
import { GunService } from "./GunService";

const ACCOUNT_TABLE_KEY = "accounts";

type Account = Record<string, string>;

@Injectable({ providedIn: "root" })
export class GunAccountService {
  constructor(readonly gun: GunService) {}

  async create(alias: string, password: string): Promise<void> {
    if (await this.exists(alias)) {
      throw new Error("Account alias already exists");
    }
    // const id = nanoid();
    // await put(this.gun.get(ACCOUNT_TABLE_KEY).get(alias), id);
    await create(this.gun.user(), alias, password);
  }

  async id(alias: string) {
    return this.gun.get(ACCOUNT_TABLE_KEY).get(alias).then();
  }

  async accounts(): Promise<Account[]> {
    return this.gun.get(ACCOUNT_TABLE_KEY).then();
  }

  async exists(alias: string): Promise<boolean> {
    const id = await this.gun.get(ACCOUNT_TABLE_KEY).get(alias).then();
    if (id) {
      return true;
    }
    return false;
  }
}
