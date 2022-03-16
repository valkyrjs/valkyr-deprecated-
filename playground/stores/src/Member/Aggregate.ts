import type { Account } from "../Account";

export type Member = {
  id: string;
  accountId: Account["id"];
};
