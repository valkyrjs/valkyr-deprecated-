import { RoleData, RolePermissions } from "@valkyr/access";

import { db } from "../database";

export const roles = db.collection<Role>("roles");

export type Role<P extends RolePermissions = RolePermissions> = {
  id: RoleData["id"];
  container: RoleData["container"];
  name: RoleData["name"];
  settings: RoleData["settings"];
  permissions: RoleData<P>["permissions"];
  members: RoleData["members"];
};
