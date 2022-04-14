import { Account as Acct } from "stores";

import { server } from "../Server";

export type Account = {
  id: string;
  status: Acct.State["status"];
  name: Acct.State["name"];
  alias: string;
  email: string;
  token: string;
};

export const accounts = server.collection<Account>("accounts");
