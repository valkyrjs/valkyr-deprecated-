import { Account } from "./Models/Account";
import { Invite } from "./Models/Invite";
import { Workspace } from "./Models/Workspace";
import { mongo } from "./Mongo";

export const collection = {
  accounts: mongo.collection<Account>("accounts"),
  invites: mongo.collection<Invite>("invites"),
  workspaces: mongo.collection<Workspace>("workspaces")
};
