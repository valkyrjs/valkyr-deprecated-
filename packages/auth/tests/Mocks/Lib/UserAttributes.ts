import { Attributes } from "../../../src/Lib/Attributes";

/*
 |--------------------------------------------------------------------------------
 | Mocks
 |--------------------------------------------------------------------------------
 */

const USER_FLAGS = {
  firstName: 1 << 0,
  lastName: 1 << 1,
  email: 1 << 2
};

type UserFilter = {
  private: number;
  friends: number;
  public: number;
};

export const profiles: Record<string, UserFilter> = {
  "user-1": {
    private: 0,
    friends: 0,
    public: 0
  },
  "user-2": {
    private: 0,
    friends: 0,
    public: 0
  }
};

/*
 |--------------------------------------------------------------------------------
 | Access Profile
 |--------------------------------------------------------------------------------
 */

export class UserAttributes extends Attributes<typeof USER_FLAGS, UserFilter> {
  constructor(privacy: UserFilter) {
    super(USER_FLAGS, { ...privacy });
  }

  public static for(userId: string) {
    const profile = profiles[userId];
    if (!profile) {
      throw new Error(`UserAccessProfile Violation: User ${userId} has no valid access profile.`);
    }
    return new UserAttributes(profile);
  }
}
