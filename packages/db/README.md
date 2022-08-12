---
title: Database
sections: ["Browsers"]
---

`@valkyr/db` provides a mongo like persistent storage solution for browsers which comes with multiple storage adapter solutions. It's meant to provide an agnostic data layer which can be used for any popular web based framework such as `react`, `vue`, `svelte`, `angular`, and any other framework.

It's a write side storage solution written to compliment [mingo](https://github.com/kofrasa/mingo) used for the read side.

This solution is specifically written for client side storage, and is not optimized for performance. The main focus of `@valkyr/db` is to provide a simple but powerful data toolkit for quality of life.

# Collections

Collections is the central entry point for storing and interacting with our data. A collection takes a `Document`, `name`, and `Adapter` instance:

```ts
import { Collection, Document, IndexedDbAdapter } from "@valkyr/db";

type UserDocument = Document & {
  name: string;
  email: string;
};

const users = new Collection<UserDocument>("users", new IndexedDbAdapter());
```

You can now write and read from the collection at your leisure.

## .insertOne

Inserts a single document and returns a insert result.

```ts
const result = await users.insertOne({ name: "John", email: "john@doe.com", views: 0 });
```

:::div{class="admonitions"}

result `InsertResult | InsertException`

```ts
type InsertResult = {
  acknowledged: true;
  insertedId: string;
};

type InsertException = {
  acknowledged: false;
  exception: Error;
};
```

:::

## .insertMany

Inserts multiple documents and returns a insert many result.

```ts
const result = await users.insertMany([
  { name: "John", email: "john@doe.com", views: 0 },
  { name: "Jane", email: "jane@doe.com", views: 0 }
]);
```

:::div{class="admonitions"}

result `InsertManyResult`

```ts
type InsertManyResult = {
  acknowledged: boolean;
  insertedIds: string[];
  exceptions: Error[];
};
```

:::

## .updateOne

Update a document using the given filter.

```ts
const result = await users.updateOne({ name: "John" }, { email: "john.doe@fixture.none" });
```

:::div{class="admonitions"}

result `UpdateResult`

```ts
type UpdateResult = {
  acknowledged: boolean;
  matchedCount: number;
  modifiedCount: number;
  exceptions: Error[];
};
```

:::

## .updateMany

Update a documents matching the given filter.

```ts
const result = await users.updateMany({ views: { $lt: 10 } }, { views: 10 });
```

:::div{class="admonitions"}

result `UpdateResult`

```ts
type UpdateResult = {
  acknowledged: boolean;
  matchedCount: number;
  modifiedCount: number;
  exceptions: Error[];
};
```

:::

## .replaceOne

## .delete

## .observe

## .observeOne

## .findById

## .find

## .findOne

## .count

## .query

# Models

Models is a convenience layer consuming a collection. While not required it introduces some quality of life features and enables the ability to expand functionality around a resource.

```ts
import { Collection, Document, IndexedDbAdapter } from "@valkyr/db";

type UserDocument = Document & {
  name: string;
  email: string;
  views!: number;
};

class User extends Model<UserDocument> {
  readonly name!: RealmDocument["name"];
  readonly email!: RealmDocument["email"];
}
```

Before you can use the model you have to provide a collection for it to interact against. There are multiple approaches to achieve this, and is mostly a matter of preference. But the main requirement is to provide a `Collection` instance to the `static $collection` property of the `Model` class.

For example you can add the collection directly on the model:

```ts
export class User extends Model<UserDocument> {
  static readonly $collection = new Collection<UserDocument>("users", new IndexedDbAdapter());

  readonly name!: UserDocument["name"];
  readonly email!: UserDocument["email"];
  readonly views!: UserDocument["views"];
}
```

Or you can use the `register` method provided by `@valkyr/db`:

```ts
import { IndexedDbAdapter, register } from "@valkyr/db";

import { User } from "./User";

register([User], new IndexedDbAdapter());
```

Once benefit of using register is that you can assign a single `Adapter` to a multitude of models in one location. This can also be useful for testing environments where you want to use a specific `Adapter` based on the environment the solution is running in.

```ts
register([User], config.isDevelopment ? new InstanceAdapter() : new IndexedDbAdapter());
```

## .insertOne

Inserts a single document and returns a new model instance:

```ts
const user = await User.insertOne({ name: "John", email: "john@doe.com", views: 0 });
```

## .insertMany

Inserts multiple documents and returns a new model instance for each inserted document.

```ts
const user = await User.insertMany([
  { name: "John", email: "john@doe.com", views: 0 },
  { name: "Jane", email: "jane@doe.com", views: 0 }
]);
```

## .updateOne

Update a document using the given filter.

```ts
await User.updateOne({ name: "John" }, { email: "john.doe@fixture.none" });
```

:::div{class="admonitions"}
This method does not return a model instance but a `UpdateResult` object.

```ts
type UpdateResult = {
  matchedCount: number;
  modifiedCount: number;
  exceptions: Error[];
};
```

:::

## .updateMany

Update a documents matching the given filter.

```ts
await User.updateMany({ views: { $lt: 10 } }, { views: 10 });
```

## .replaceOne

## .delete

## .subscribe

## .observe

## .observeOne

## .find

## .findOne

## .count

# Operations

## $set

## $unset

## $push

## $pull

## Caveats

[$set elements in arrays](https://www.mongodb.com/docs/manual/reference/operator/update/set/#set-elements-in-arrays)

### MongoDB

```ts
db.products.updateOne(
  { _id: 100 },
  {
    $set: {
      "tags.1": "rain gear",
      "ratings.0.rating": 2
    }
  }
);
```

### ValkyrDB

```ts
products.updateOne(
  { _id: 100 },
  {
    $set: {
      "tags[1]": "rain gear",
      "ratings[0].rating": 2
    }
  }
);
```

# React

For react `@valkyr/db` acts as a globally observed persistent state store. Whenever you update a model, any query subscriber which has a matching query filter against the data changed will be informed and update the component state.

## Example

```ts
import { userQuery } from "@valkyr/db/react";

function User({ id }: { id: string }) {
  const [user, loading, error] = useUser(id);

  if (loading === true) {
    return <div>Loading user ...</div>;
  }

  if (error) {
    return <div>Error! {error.message}</div>;
  }

  if (user === undefined) {
    return <div>User with {id} was not found!</div>;
  }

  return <div>Hello {user.name}</div>;
}

function useUser(id: string): [User | undefined, boolean, Error | undefined] {
  return useQuery(User, {
    where: {
      id
    },
    limit: 1
  });
}
```
