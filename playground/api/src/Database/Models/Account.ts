import { Account as Aggregate } from "stores";

export type Account = {
  id: string;
  status: Aggregate["status"];
  name: Aggregate["name"];
  alias: string;
  email: string;
  token: string;
};
