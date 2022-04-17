/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type RolePermissions = Record<Category, Actions>;

export type Category = string;

export type Actions = Record<Category, Action>;

export type Action = Value | Value[];

export type Value = Record<string, unknown> | string | boolean | number;

export type Operation<Resource, Action, Data = unknown> =
  | SetOperation<Resource, Action, Data>
  | UnsetOperation<Resource, Action>;

type SetOperation<Resource, Action, Data> = {
  type: "set";
  resource: Resource;
  action: Action;
  data?: Data;
};

type UnsetOperation<Resource, Action> = {
  type: "unset";
  resource: Resource;
  action?: Action;
};

/*
 |--------------------------------------------------------------------------------
 | Role Permission
 |--------------------------------------------------------------------------------
 */

export class RolePermission<
  Permissions extends Record<string, Actions> = Record<string, Actions>,
  Resource extends keyof Permissions = keyof Permissions,
  Action extends keyof Permissions[Resource] = keyof Permissions[Resource]
> {
  public readonly operations: Operation<Resource, Action>[] = [];

  constructor(public readonly roleId: string) {
    this.grant = this.grant.bind(this);
    this.deny = this.deny.bind(this);
    this.commit = this.commit.bind(this);
  }

  public grant(resource: Resource, action: Action): this;
  public grant<T = unknown>(resource: Resource, action: Action, data: T): this;
  public grant<T = unknown>(resource: Resource, action: Action, data?: T): this {
    this.operations.push({ type: "set", resource, action, data: data ?? true });
    return this;
  }

  public deny(resource: Resource, action?: Action): this {
    this.operations.push({ type: "unset", resource, action });
    return this;
  }

  public async commit(): Promise<void> {
    console.log("Commit permissions", this.roleId, this.operations);
    // await db.setPermissions(this.roleId, this.operations);
  }
}

/*
 |--------------------------------------------------------------------------------
 | Utilities
 |--------------------------------------------------------------------------------
 */

export const permissionOperation = {
  set(update: Record<string, any>, operation: SetOperation<any, any, any>) {
    const { resource, action, data = true } = operation;
    return {
      ...update,
      $set: {
        ...(update.$set ?? {}),
        [`permissions.${resource}.${action}`]: data
      }
    };
  },
  unset(update: Record<string, any>, operation: UnsetOperation<any, any>) {
    const { resource, action } = operation;
    let path = `permissions.${resource}`;
    if (action) {
      path += `.${action}`;
    }
    return {
      ...update,
      $unset: {
        ...(update.$unset ?? {}),
        [path]: ""
      }
    };
  }
};
