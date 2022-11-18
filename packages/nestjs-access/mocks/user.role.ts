import { Role } from "@valkyr/access";

export class UserRole extends Role<UserPermissions> {
  static reduce(state: UserPermissions, permissions: Partial<UserPermissions>): UserPermissions {
    return {
      users: {
        create: permissions.users?.create === true || state.users.create === true
      }
    };
  }
}

export type UserPermissions = {
  users: {
    create: boolean;
  };
};
