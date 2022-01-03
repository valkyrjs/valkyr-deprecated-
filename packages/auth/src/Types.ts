import { Permission } from "./Lib/Permission";

/*
 |--------------------------------------------------------------------------------
 | Permissions
 |--------------------------------------------------------------------------------
 */

export type Actions = Record<string, Action>;

export type Action = Value | Value[];

export type Value = Record<string, unknown> | string | boolean | number;

/*
 |--------------------------------------------------------------------------------
 | Query
 |--------------------------------------------------------------------------------
 */

export type Query<Data extends Value, Props extends Value> = (data: Data) => PermissionHandler<Props>;

export type PermissionHandler<Props extends Value = any> = (props: Props) => Permission;

/*
 |--------------------------------------------------------------------------------
 | Operation
 |--------------------------------------------------------------------------------
 |
 | Type defenitions detailing the operation structure of updating a roles
 | permissions layers. This provides the ability for service providers to take
 | a operation set and create its own insert logic.
 |
 */

export type Operation<Resource, Action, Data = unknown> = SetOperation<Resource, Action, Data> | UnsetOperation<Resource, Action>;

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
