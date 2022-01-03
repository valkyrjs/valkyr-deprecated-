/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
};

/*
 |--------------------------------------------------------------------------------
 | Mocks
 |--------------------------------------------------------------------------------
 */

export const users: Record<string, User> = {
  "user-1": {
    id: "user-1",
    firstName: "John",
    lastName: "Doe",
    email: "john@doe.com"
  },
  "user-2": {
    id: "user-2",
    firstName: "Jane",
    lastName: "Doe",
    email: "jane@doe.com"
  }
};
