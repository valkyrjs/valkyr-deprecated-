import { Injectable } from "@nestjs/common";
import {
  permissionDenied,
  PermissionDeniedError,
  permissionGranted,
  PermissionHandler,
  Role as AccessRole
} from "@valkyr/access";

import { PermissionService } from "./Permission";
import { RoleService } from "./Role";

@Injectable()
export class AccessService<
  Permissions extends AccessRole["permissions"] = AccessRole["permissions"],
  Resource extends keyof Permissions = keyof Permissions
> {
  constructor(protected readonly roles: RoleService<Permissions>, protected readonly permissions: PermissionService) {}

  public for<R extends Resource>(resource: R) {
    return {
      can: async <A extends keyof Permissions[R], Handler extends PermissionHandler>(
        memberId: string,
        action: A,
        handler?: Handler
      ) => {
        const permissions = await this.permissions.get<Permissions>(memberId);
        const value = permissions[resource][action];
        if (value === undefined || value === false) {
          return permissionDenied(new PermissionDeniedError(action, resource).message);
        }
        if (value === true || handler === undefined) {
          return permissionGranted();
        }
        return handler(value);
      }
    };
  }
}
