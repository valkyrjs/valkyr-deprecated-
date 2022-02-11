import { container } from "../Container";
import { RolePermission } from "./RolePermission";
import type { Actions, RoleData } from "./Types";
import { deepCopy } from "./Utils";

export class Role<
  Permissions extends Record<string, Actions> = Record<string, Actions>,
  Settings extends Record<string, unknown> = Record<string, unknown>
> {
  public readonly roleId = this.role.roleId;

  public readonly name = this.role.name;
  public readonly settings = this.role.settings;
  public readonly permissions = this.role.permissions;
  public readonly members = Object.freeze(this.role.members);

  constructor(private readonly role: RoleData<Permissions>) {
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

  public toJSON(): {
    roleId: string;
    name: string;
    settings: Settings;
    permissions: Permissions;
    members: string[];
  } {
    return deepCopy({
      roleId: this.roleId,
      name: this.name,
      settings: this.settings,
      permissions: this.permissions,
      members: [...this.members]
    });
  }
}
