import { Attributes as BaseAttributes } from "../Attributes";
import { Value } from "../Role";
import type { Permission } from "./Permission";

export type Response<Attributes extends BaseAttributes = BaseAttributes> = Granted<Attributes> | Denied;

export type Granted<Attributes extends BaseAttributes> = {
  granted: true;
  attributes?: Attributes;
};

export type Denied = {
  granted: false;
  message?: string;
};

export type Query<Data extends Value, Props extends Value> = (data: Data) => PermissionHandler<Props>;

export type PermissionHandler<Props extends Value = any> = (props: Props) => Permission;
