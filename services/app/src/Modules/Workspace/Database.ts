import { Document, IndexedDatabase } from "@valkyr/db";

export const db = new IndexedDatabase<Collections>({
  name: "module:workspace",
  version: 1,
  registrars: [
    {
      name: "workspaces"
    }
  ]
});

/*
 |--------------------------------------------------------------------------------
 | Collections
 |--------------------------------------------------------------------------------
 */

type Collections = {
  workspaces: Workspace;
};

/*
 |--------------------------------------------------------------------------------
 | Workspace
 |--------------------------------------------------------------------------------
 */

export type Workspace = Document<{
  name: string;
  users: WorkspaceUser[];
}>;

type WorkspaceUser = {
  userId: string;
  name: string;
};
