import { Workspace as Wksp } from "stores";

export type Workspace = {
  id: string;
  name: string;
  members: Wksp.Member[];
};
