import { RoleData } from "@valkyr/access";
import { Account, Workspace } from "stores";

import { mongo } from "./Lib/Mongo";

export const collection = {
  accounts: mongo.collection<Account>("accounts"),
  roles: mongo.collection<RoleData<any>>("roles"),
  workspaces: mongo.collection<Workspace>("workspaces")
};
