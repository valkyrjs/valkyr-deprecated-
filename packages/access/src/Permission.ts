import { Attributes as BaseAttributes } from "./Attributes";
import type { Value } from "./RolePermission";

export const PERMISSION_DENIED_MESSAGE = "Permission denied";

/*
 |--------------------------------------------------------------------------------
 | Errors
 |--------------------------------------------------------------------------------
 */

export class PermissionDeniedError extends Error {
  static type = "PermissionDeniedError";

  constructor(action: any, resource: any) {
    super(`Access Permission Violation: Denied access performing action '${action}' on '${resource}'.`);
  }
}

/*
 |--------------------------------------------------------------------------------
 | Responses
 |--------------------------------------------------------------------------------
 */

export function permissionGranted<Attributes extends BaseAttributes = BaseAttributes>(
  attributes?: Attributes
): Granted {
  return {
    granted: true,
    attributes,
    filter: <Data extends Record<string, unknown>>(data: Data | Data[]) => {
      if (attributes === undefined) {
        return data;
      }
      if (Array.isArray(data)) {
        return data.map(attributes.filter);
      }
      return attributes.filter(data);
    }
  };
}

export function permissionDenied(message?: string): Denied {
  return {
    granted: false,
    message: message ?? "Access Violation: You are not permitted to perform this action"
  };
}

/*
 |--------------------------------------------------------------------------------
 | Defaults
 |--------------------------------------------------------------------------------
 */

/**
 * Default granted permission handler.
 *
 * @remarks
 *
 * This default fallback is used for simple resource actions with a boolean
 * value which always resolved to true.
 */
export function defaultPermissionHandler() {
  return permissionGranted();
}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Response<Attributes extends BaseAttributes = BaseAttributes> = Granted<Attributes> | Denied;

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
