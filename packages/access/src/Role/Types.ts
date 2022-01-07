import type { Role } from "./Role";

export type RoleData<Permissions extends Record<string, Actions> = Record<string, Actions>> = ReturnType<
  Role<Permissions>["toJSON"]
>;

export type Actions = Record<string, Action>;

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
