import { RoleEntity } from "../src/models/role.entity";
import { AccessService } from "../src/services/access.service";
import { UserPermissions, UserRole } from "./user.role";

export class UserAccessService extends AccessService<UserPermissions> {
  #permissions: UserPermissions = {
    users: {
      create: false
    }
  };

  reduce(roles: RoleEntity<UserPermissions>[]): UserPermissions {
    return roles.reduce<UserPermissions>(
      (state, { permissions }) => UserRole.reduce(state, permissions),
      this.#permissions
    );
  }
}
