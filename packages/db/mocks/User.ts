import { Collection, Document, InstanceAdapter, MemoryAdapter, Model } from "../src";

export type UserDocument = Document & {
  name: string;
  email: string;
  friends: Friend[];
};

type Friend = {
  id: string;
  alias: string;
};

export class User extends Model<UserDocument> {
  static readonly $collection = new Collection<UserDocument>("users", new MemoryAdapter<UserDocument>());

  readonly name!: UserDocument["name"];
  readonly email!: UserDocument["email"];
  readonly friends!: UserDocument["friends"];
}

export const data: UserDocument[] = [
  {
    id: "user-1",
    name: "John Doe",
    email: "john.doe@test.none",
    friends: [
      {
        id: "user-2",
        alias: "Jane"
      },
      {
        id: "user-3",
        alias: "James"
      }
    ]
  },
  {
    id: "user-2",
    name: "Jane Doe",
    email: "jane.doe@test.none",
    friends: []
  },
  {
    id: "user-3",
    name: "James Doe",
    email: "james.doe@test.none",
    friends: []
  }
];

export async function getMockedCollection() {
  const collection = new Collection<UserDocument>("users", new InstanceAdapter());

  await collection.insertMany(data);

  return { collection, documents: data };
}
