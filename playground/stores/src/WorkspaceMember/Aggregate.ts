import type { Account } from "../Account";
import { Workspace } from "../Workspace/Aggregate";

export type WorkspaceMember = {
  id: string;
  workspaceId: Workspace["id"];
  accountId: Account["id"];
};
