import { Attributes } from "../../../src/Attributes";

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

export function getUserAttributes(userId: string) {
  return new Attributes(USER_FLAGS, { ...getUserFilter(userId) });
}

function getUserFilter(userId: string): UserFilter {
  const profile = profiles[userId];
  if (!profile) {
    throw new Error(`UserAccessProfile Violation: User ${userId} has no valid access profile.`);
  }
  return profile;
}
