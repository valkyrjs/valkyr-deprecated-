import { Attributes as BaseAttributes } from "../Attributes";
import { Value } from "../Role";

export type Response<Attributes extends BaseAttributes = BaseAttributes> = Granted<Attributes> | Denied;

export type QueryHandler<Props extends Value = any> = (props: Props) => Granted | Denied;

export type Query<Data extends Value, Props extends Value> = (data: Data) => PermissionHandler<Props>;

export type PermissionHandler<Props extends Value = any> = (props: Props) => Granted | Denied;

export type Granted<Attributes extends BaseAttributes = BaseAttributes> = {
  granted: true;
  attributes?: Attributes;
  filter<Data extends Record<string, unknown>>(data: Data | Data[], filter?: string): Partial<Data> | Partial<Data>[];
};

export type Denied = {
  granted: false;
  message: string;
};
