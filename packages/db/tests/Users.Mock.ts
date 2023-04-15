import { clone } from "../src/Clone.js";
import { Document } from "../src/Storage/mod.js";

const now = Date.now();

const users: UserDocument[] = [
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
    interests: ["movies", "tv", "sports"],
    $meta: {
      createdAt: now,
      updatedAt: now
    }
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
    interests: ["movies", "fitness", "dance"],
    $meta: {
      createdAt: now,
      updatedAt: now
    }
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
