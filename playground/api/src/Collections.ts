import { RoleData } from "@valkyr/access";
import type { Account } from "stores";

import { mongo } from "./Lib/Mongo";

export const collection = {
  accounts: mongo.collection<Account>("accounts"),
  roles: mongo.collection<RoleData<any>>("roles")
};
