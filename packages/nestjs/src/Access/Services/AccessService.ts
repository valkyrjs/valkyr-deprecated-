import { Injectable } from "@nestjs/common";
import {
  permissionDenied,
  PermissionDeniedError,
  permissionGranted,
  PermissionHandler,
  Role as AccessRole
} from "@valkyr/access";

import { PermissionService } from "./PermissionService";
import { RoleService } from "./RoleService";

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
        if (handler === undefined) {
          return this.getPermissionByValue(value, action, resource);
        }
        return handler(value);
      }
    };
  }

  private getPermissionByValue(value: unknown, action: unknown, resource: unknown) {
    if (value === true) {
      return permissionGranted();
    }
    return permissionDenied(new PermissionDeniedError(action, resource).message);
  }
}
