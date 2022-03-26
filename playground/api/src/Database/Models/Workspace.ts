import { WorkspaceMember } from "stores";

export type Workspace = {
  id: string;
  name: string;
  members: WorkspaceMember[];
};
