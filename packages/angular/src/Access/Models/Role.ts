import { Injectable } from "@angular/core";
import { Document, Model } from "@valkyr/db";

export type RoleDocument = Document & {
  tenantId: string;
  roleId: string;
  name: string;
  settings: Record<string, unknown>;
  permissions: Record<string, unknown>;
  members: string[];
};

@Injectable({ providedIn: "root" })
export class Role extends Model<RoleDocument> {
  readonly tenantId!: RoleDocument["tenantId"];
  readonly roleId!: RoleDocument["roleId"];
  readonly name!: RoleDocument["name"];
  readonly settings!: RoleDocument["settings"];
  readonly permissions!: RoleDocument["permissions"];
  readonly members!: RoleDocument["members"];
}

export type RoleModel = typeof Role;
