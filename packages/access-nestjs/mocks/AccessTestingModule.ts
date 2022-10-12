import { Module } from "@nestjs/common";
import { Role as AccessRole } from "@valkyr/access";

import { AccessModule, AccessService, Role } from "../src";

/*
 |--------------------------------------------------------------------------------
 | Role
 |--------------------------------------------------------------------------------
 */

class TestRole extends AccessRole<TestPermissions> {
  static reduce(state: TestPermissions, permissions: Partial<TestPermissions>): TestPermissions {
    return {
      users: {
        create: permissions.users?.create === true || state.users.create === true
      }
    };
  }
}

/*
 |--------------------------------------------------------------------------------
 | Service
 |--------------------------------------------------------------------------------
 */

export class TestAccessService extends AccessService<TestPermissions> {
  #permissions: TestPermissions = {
    users: {
      create: false
    }
  };

  reduce(roles: Role<TestPermissions>[]): TestPermissions {
    return roles.reduce<TestPermissions>(
      (state, { permissions }) => TestRole.reduce(state, permissions),
      this.#permissions
    );
  }
}

/*
 |--------------------------------------------------------------------------------
 | Module
 |--------------------------------------------------------------------------------
 */

@Module({
  imports: [AccessModule],
  providers: [TestAccessService]
})
export class AccessTestingModule {}

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type TestPermissions = {
  users: {
    create: boolean;
  };
};
