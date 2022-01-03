import { Permission } from "./Permission";
import type { Role } from "./Role";

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Query<Props extends Value = any> = (props: Props) => Permission;

type Value = Record<string, unknown> | string | boolean | number;

/*
 |--------------------------------------------------------------------------------
 | Access Control
 |--------------------------------------------------------------------------------
 */

export abstract class Access<
  Permissions extends Role["permissions"] = Role["permissions"],
  Resource extends keyof Permissions = keyof Permissions,
  Action extends keyof Permissions[Resource] = keyof Permissions[Resource]
> {
  public readonly permissions: Permissions;

  constructor(permissions: Permissions) {
    this.permissions = permissions;
  }

  public can<Handler extends Query>(action: Action, resource: Resource, handler?: Handler) {
    const value = this.permissions[resource][action];
    if (!value) {
      return new Permission({ granted: false });
    }
    if (handler) {
      return handler(value);
    }
    return new Permission({ granted: true });
  }
}
