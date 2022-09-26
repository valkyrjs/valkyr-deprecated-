import { clone } from "../src/Clone";
import { Document } from "../src/Storage";

export const users: UserDocument[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@test.none",
    friends: [
      {
        id: "user-2",
        alias: "Jane"
      }
    ],
    interests: ["movies", "tv", "sports"]
  },
  {
    id: "user-2",
    name: "Jane Doe",
    email: "jane.doe@test.none",
    friends: [
      {
        id: "user-1",
        alias: "John"
      }
    ],
    interests: ["movies", "fitness", "dance"]
  }
];

export function getUsers(): UserDocument[] {
  return clone(users);
}

export type UserDocument = Document & {
  name: string;
  email: string;
  friends: Friend[];
  interests: string[];
};

type Friend = {
  id: string;
  alias: string;
};
