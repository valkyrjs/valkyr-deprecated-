import { Attributes } from "@valkyr/access";

import type { Account } from "../Aggregate";

export const ACCOUNT_FLAGS: Record<keyof Account, number> = {
  accountId: 1 << 0,
  status: 1 << 1,
  alias: 1 << 2,
  name: 1 << 3,
  email: 1 << 4,
  token: 1 << 5
};

export type Filters = {
  owner: number;
  public: number;
};

export class AccountAttributes extends Attributes<typeof ACCOUNT_FLAGS, Filters> {
  constructor(filters: Filters) {
    super(ACCOUNT_FLAGS, filters);
  }
}