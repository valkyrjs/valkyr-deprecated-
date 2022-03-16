import { Workspace } from "../Workspace";

export type Todo = {
  id: string;
  workspaceId: Workspace["id"];
  name: string;
};
