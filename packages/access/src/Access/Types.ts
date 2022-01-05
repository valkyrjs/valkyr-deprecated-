import type { Permission } from "../Permission";

export type Query<Props extends Value = any> = (props: Props) => Permission;

type Value = Record<string, unknown> | string | boolean | number;
