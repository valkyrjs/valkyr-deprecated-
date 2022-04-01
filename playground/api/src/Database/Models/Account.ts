import { Account as Acct } from "stores";

export type Account = {
  id: string;
  status: Acct.State["status"];
  name: Acct.State["name"];
  alias: string;
  email: string;
  token: string;
};
