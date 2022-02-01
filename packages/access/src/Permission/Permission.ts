import { Attributes as BaseAttributes } from "../Attributes";
import { container } from "../Container";
import type { Role } from "../Role";
import type { Denied, Granted, PermissionHandler } from "./Types";

export const PERMISSION_DENIED_MESSAGE = "Permission denied";

class PermissionDeniedError extends Error {
  public static type = "PermissionDeniedError";

  constructor(action: any, resource: any) {
    super(`Access Permission Violation: Denied access performing action '${action}' on '${resource}'.`);
  }
}

export function createPermission<
  Permissions extends Role["permissions"] = Role["permissions"],
  Resource extends keyof Permissions = keyof Permissions,
  Action extends keyof Permissions[Resource] = keyof Permissions[Resource]
>() {
  return (tenantId: string, memberId: string) => ({
    async can<Handler extends PermissionHandler>(action: Action, resource: Resource, handler?: Handler) {
      const permissions: Permissions = await container.get("Database").getPermissions(tenantId, memberId);
      const value = permissions[resource][action];
      if (value === undefined) {
        return permissionDenied(new PermissionDeniedError(action, resource).message);
      }
      if (handler === undefined) {
        return permissionGranted();
      }
      return handler(value);
    }
  });
}

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
