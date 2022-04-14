import { Workspace as Wksp } from "stores";

import { server } from "../Server";

export type Workspace = {
  id: string;
  name: string;
  invites: Wksp.Invite[];
  members: Wksp.Member[];
};

export const workspaces = server.collection<Workspace>("workspaces");
