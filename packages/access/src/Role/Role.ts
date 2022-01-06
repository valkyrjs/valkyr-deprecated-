import { container } from "../Container";
import { RolePermission } from "./RolePermission";
import type { Actions, RoleData } from "./Types";
import { deepCopy } from "./Utils";

export abstract class Role<
  Permissions extends Record<string, Actions> = Record<string, Actions>,
  Settings extends Record<string, unknown> = Record<string, unknown>
> {
  public readonly roleId: string;
  public readonly tenantId: string;

  public readonly name: string;
  public readonly settings: Settings;
  public readonly permissions: Permissions;
  public readonly members: readonly string[];

  constructor(role: RoleData<Permissions>) {
    this.roleId = role.roleId;
    this.tenantId = role.tenantId;
    this.name = role.name;
    this.settings = role.settings as Settings;
    this.permissions = role.permissions as Permissions;
    this.members = Object.freeze(role.members);
    Object.freeze(this);
  }

  /*
   |--------------------------------------------------------------------------------
   | Permissions
   |--------------------------------------------------------------------------------
   */

  public get grant() {
    return new RolePermission<Permissions>(this.roleId).grant;
  }

  public get deny() {
    return new RolePermission<Permissions>(this.roleId).deny;
  }

  /*
   |--------------------------------------------------------------------------------
   | Members
   |--------------------------------------------------------------------------------
   */

  public async addMember(memberId: string, db = container.get("Database")) {
    return db.addMember(this.roleId, memberId);
  }

  public async delMember(memberId: string, db = container.get("Database")) {
    return db.delMember(this.roleId, memberId);
  }

  /*
   |--------------------------------------------------------------------------------
   | Serializers
   |--------------------------------------------------------------------------------
   */

  public toJSON() {
    return deepCopy({
      roleId: this.roleId,
      tenantId: this.tenantId,
      name: this.name,
      settings: this.settings,
      permissions: this.permissions,
      members: [...this.members]
    });
  }
}
