import { container } from "../Container";
import type { Actions, Operation } from "../Types";

export class RolePermission<
  Permissions extends Record<string, Actions> = Record<string, Actions>,
  Resource extends keyof Permissions = keyof Permissions,
  Action extends keyof Permissions[Resource] = keyof Permissions[Resource]
> {
  public readonly roleId: string;
  public readonly operations: Operation<Resource, Action>[] = [];

  constructor(roleId: string) {
    this.roleId = roleId;
    this.grant = this.grant.bind(this);
    this.deny = this.deny.bind(this);
    this.commit = this.commit.bind(this);
  }

  public grant(resource: Resource, action: Action): this;
  public grant<T = unknown>(resource: Resource, action: Action, data: T): this;
  public grant<T = unknown>(resource: Resource, action: Action, data: T | boolean = true): this {
    this.operations.push({ type: "set", resource, action, data });
    return this;
  }

  public deny(resource: Resource, action?: Action): this {
    this.operations.push({ type: "unset", resource, action });
    return this;
  }

  public async commit(db = container.get("Database")): Promise<void> {
    await db.setPermissions(this.roleId, this.operations);
  }
}
