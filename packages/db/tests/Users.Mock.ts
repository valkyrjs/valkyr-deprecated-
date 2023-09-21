import { clone } from "../src/Clone.js";
import { WithId } from "../src/Types.js";

const users: WithId<UserDocument>[] = [
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

export function getUsers(): WithId<UserDocument>[] {
  return clone(users);
}

export type UserDocument = {
  name: string;
  email: string;
  friends: Friend[];
  interests: string[];
};

type Friend = {
  id: string;
  alias: string;
};
