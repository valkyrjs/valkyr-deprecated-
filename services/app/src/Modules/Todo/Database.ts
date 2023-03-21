import { Document, IndexedDatabase } from "@valkyr/db";

export const db = new IndexedDatabase<Collections>({
  name: "module:todo",
  version: 1,
  registrars: [
    {
      name: "todos"
    }
  ]
});

/*
 |--------------------------------------------------------------------------------
 | Collections
 |--------------------------------------------------------------------------------
 */

type Collections = {
  todos: Todo;
};

/*
 |--------------------------------------------------------------------------------
 | Workspace
 |--------------------------------------------------------------------------------
 */

export type Todo = Document<{
  workspaceId: string;
  description: string;
  completed: boolean;
}>;
