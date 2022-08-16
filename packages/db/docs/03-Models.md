---
title: Models
sections: ["Database"]
---

Models is a convenience layer consuming a collection. While not required it introduces some quality of life features and enables the ability to expand functionality around a resource.

```ts
import { Collection, Document, IndexedDbAdapter, Model } from "@valkyr/db";

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

---

# Collection

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

---

# Methods

A model provides the same methods provided by a collection instance. For some methods however the returned result differs from the collection version of the same method.

Take care to note the following differentiating methods:

---

## .insertOne()

In a collection `.insertOne` returns a insert result. When executed on a model it returns a instance of the created document.

**Definition**

```ts
Model.insertOne(document: PartialDocument<UserDocument>): Promise<User>;
```

**Example**

```ts
const user = await User.insertOne({ name: "John", email: "john@doe.com", views: 0 });
```

---

## .insertMany()

In a collection `.insertMany` returns a insert many result. When executed on a model it returns instances of the created documents.

**Definition**

```ts
Model.insertMany(documents: PartialDocument<UserDocument>[]): Promise<User[]>;
```

**Example**

```ts
const users = await User.insertMany([
  { name: "John", email: "john@doe.com", views: 0 },
  { name: "Jane", email: "jane@doe.com", views: 0 }
]);
```

---

# Subscriptions

A model provides an additional subscription method on top of the `.observe` and `.observeOne` methods found on a collection. The role of the `subscribe` method is to initiate an observer pattern based on the `criteria` and `options` provided, and funnels any changes into the provided `next` method.

It returns a `Subscription` instance from a `Observable` which is used to unsubscribe as documented in the collections section of this documentation.

**Definition**

```ts
Model.subscribe(criteria: RawObject = {}, options?: Options, next?: Function): Subscription;
```

**Examples**

Observing a list of documents through `.find` behavior:

```ts
const subscription = User.subscribe({ name: "John" }, {}, (users) => {
  // observed version of any models matching the name John
});
```

Observing a single document through `.findOne` behavior:

```ts
const subscription = User.subscribe({ name: "John" }, { limit: 1 }, (user) => {
  // observed version of any model matching the name John, or undefined if no matches are found
});
```

---

# Updating

Since models are quality of life instantiators, an update method is provided where you provide the update data directly and get a new immutable version of the updated document.

---

## .update

Update the current instance with the provided `update`.

**Definition**

```ts
model.update(update: UpdateOperations): Promise<this>;
```

**Example**

```ts
const nextUser = await user.update({ name: "Dave" });
```
