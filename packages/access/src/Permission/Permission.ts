import { Attributes as BaseAttributes } from "../Attributes";
import { container } from "../Container";
import type { Role } from "../Role";
import type { Permission, QueryHandler, Response } from "./Types";

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
    async can<Handler extends QueryHandler>(action: Action, resource: Resource, handler?: Handler) {
      const permissions: Permissions = await container.get("Database").getPermissions(tenantId, memberId);
      const value = permissions[resource][action];
      if (value === undefined) {
        return permission({ granted: false, message: new PermissionDeniedError(action, resource).message });
      }
      if (handler === undefined) {
        return permission({ granted: true });
      }
      return handler(value);
    }
  });
}

export function permission<Attributes extends BaseAttributes = BaseAttributes>(response: Response<Attributes>): Permission {
  if (response.granted === true) {
    return {
      ...response,
      filter: <Data extends Record<string, unknown>>(data: Data | Data[], filter = "$all") => {
        if (response.attributes === undefined) {
          return data;
        }
        if (Array.isArray(data)) {
          return data.map((data) => response.attributes!.filter(filter, data));
        }
        return response.attributes.filter(filter, data);
      }
    };
  }
  return response;
}
