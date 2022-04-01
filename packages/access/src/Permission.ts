import { Attributes as BaseAttributes } from "./Attributes";
import { db } from "./Database";
import type { Role } from "./Role";
import type { Value } from "./RolePermission";

export const PERMISSION_DENIED_MESSAGE = "Permission denied";

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

/*
 |--------------------------------------------------------------------------------
 | Errors
 |--------------------------------------------------------------------------------
 */

class PermissionDeniedError extends Error {
  public static type = "PermissionDeniedError";

  constructor(action: any, resource: any) {
    super(`Access Permission Violation: Denied access performing action '${action}' on '${resource}'.`);
  }
}

/*
 |--------------------------------------------------------------------------------
 | Permission
 |--------------------------------------------------------------------------------
 */

export function createPermission<
  Permissions extends Role["permissions"] = Role["permissions"],
  Resource extends keyof Permissions = keyof Permissions
>() {
  return <R extends Resource>(resource: R, memberId: string) => ({
    async can<A extends keyof Permissions[R], Handler extends PermissionHandler>(action: A, handler?: Handler) {
      const permissions: Permissions = await db.getPermissions(memberId);
      const value = permissions[resource][action];
      if (value === undefined || value === false) {
        return permissionDenied(new PermissionDeniedError(action, resource).message);
      }
      if (value === true || handler === undefined) {
        return permissionGranted();
      }
      return handler(value);
    }
  });
}

export function getPermissions<P extends Role["permissions"] = Role["permissions"]>() {
  return async (memberId: string): Promise<P> => {
    return db.getPermissions(memberId);
  };
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
