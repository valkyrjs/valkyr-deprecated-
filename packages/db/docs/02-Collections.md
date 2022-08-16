---
title: Collections
sections: ["Database"]
---

A collection is a grouping of `@valkyr/db` documents. Documents within a collection can have different fields. A collection is the equivalent of a table in a relational database system.

In `@valkyr/db` there is no central `database` instance. Instead we simply create a collection and assign it to a variable of our choosing. A collection will automatically resolve and persist data when performing operations against it, so no preload step is required when interacting with a collection.

**Example**

```ts
import { Collection, Document, IndexedDbAdapter } from "@valkyr/db";

type UserDocument = Document & {
  name: string;
  email: string;
};

const users = new Collection<UserDocument>("users", new IndexedDbAdapter());
```

---

# Insert Documents

`@valkyr/db` provides the following methods of inserting `documents` into a collection:

---

## .insertOne

Inserts a single document and returns a insert result.

**Definition**

```ts
collection.insertOne(document: PartialDocument<D>): Promise<InsertResult | InsertException>;
```

**Example**

```ts
const result = await users.insertOne({ name: "John", email: "john@doe.com", views: 0 });
```

**Types**

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

---

## .insertMany

Inserts multiple documents and returns a insert many result.

**Definition**

```ts
collection.insertMany(documents: PartialDocument<D>[]): Promise<InsertManyResult>;
```

**Example**

```ts
const result = await users.insertMany([
  { name: "John", email: "john@doe.com", views: 0 },
  { name: "Jane", email: "jane@doe.com", views: 0 }
]);
```

**Types**

```ts
type InsertManyResult = {
  acknowledged: boolean;
  insertedIds: string[];
  exceptions: Error[];
};
```

---

# Query Documents

`@valkyr/db` provides the following methods of querying `documents` in a collection:

Additional information can be found through [mongodb](https://www.mongodb.com/docs/v5.0/tutorial/query-documents) documentation.

`@valkyr/db` uses [mingo](https://github.com/kofrasa/mingo) as the query driver, an excellent solution brining mongodb queries to TypeScript. Please refer to [differences from mongodb](https://github.com/kofrasa/mingo#differences-from-mongodb) to familiarize yourself with query differences.

---

## .findById

Returns `document` that satisfies the specified `id`.

**Definition**

```ts
collection.findById(id: string): Promise<Document | undefined>;
```

This is a specialized method which reads the record straight from the document `storage` map. This is the most optimized method for fetching a known document and is the only query method that does not utilize [mingo](https://github.com/kofrasa/mingo).

**Example**

```ts
const user = await users.findById("xyz");
```

---

## .find

Returns documents that satisfies the specified query `criteria` and `options` on the collection.

**Definition**

```ts
collection.find(criteria: RawObject = {}, options?: Options): Promise<Document[]>;
```

See [mongo.find()](https://www.mongodb.com/docs/v4.4/reference/method/db.collection.find) for additional information.

**Example**

```ts
const users = await users.find({ name: "John" });
```

**Types**

```ts
type Options = {
  sort?: {
    [key: string]: 1 | -1;
  };
  skip?: number;
  limit?: number;
};
```

---

## .findOne

Returns one `document` that satisfies the specified query `criteria` and `options` on the collection. If multiple documents satisfy the query, this method returns the first `document` according to the natural order which reflects the order of documents on the disk. In capped collections, natural order is the same as insertion order. If no `document` satisfies the query, the method returns `undefined`.

**Definition**

```ts
collection.findOne(criteria: RawObject = {}, options?: Options): Promise<Document | undefined>;
```

See [mongo.findOne()](https://www.mongodb.com/docs/v4.4/reference/method/db.collection.findOne) for additional information.

**Example**

```ts
const user = await users.findOne({ name: "John" });
```

**Types**

```ts
type Options = {
  sort?: {
    [key: string]: 1 | -1;
  };
  skip?: number;
  limit?: number;
};
```

---

## .count

Returns the count of documents that would match a `find()` query for the collection. The `collection.count()` method does not perform the `find()` operation but instead counts and returns the number of results that match a query.

**Definition**

```ts
collection.count(criteria: RawObject = {}): Promise<number>;
```

**Example**

```ts
const userCount = await users.count({ email: { $regex: /@test\.com/i } });
```

---

## .query

Selects documents in a collection that satisfies the specified query `criteria` and returns a cursor to the selected documents.

**Definition**

```ts
collection.query(criteria: RawObject = {}): Promise<Cursor>;
```

**Example**

```ts
const cursor = await users.query({ email: { $regex: /john@/i } });
// perform additional filtering behavior on the cursor
const users = cursor.all();
```

---

# Observe Documents

Subscriptions provides a observation layer for `.find` and `.findOne` type data filtering and wraps it in a `rxjs` observer instance. Any time the collection sees changes to data matching the observation filter the observer subscription is notified and forwards the changes.

---

## .observe

Returns observable which observes documents that satisfies the specified query `criteria` and `options` on the collection.

**Definition**

```ts
collection.observe(criteria: RawObject = {}, options?: Options): Observable<Document[]>;
```

**Example**

```ts
const subscription = users.observe({ name: "John" }).subscribe((users) => {
  // list of users with name John
});
```

---

## .observeOne

Returns observable which observes document that satisfies the specified query `criteria` on the collection. If no `document` satisfies the query, the observer returns `undefined`.

**Definition**

```ts
collection.observeOne(criteria: RawObject = {}): Observable<Document | undefined>;
```

**Example**

```ts
const subscription = users.observeOne({ name: "Jane" }).subscribe((user) => {
  // closest user with name Jane
});
```

:::div{class="admonitions"}

Make sure to close the subscription when it is no longer needed or it will linger past its use. You can do this by simply executing the `.unsubscribe()` method on the `subscription` instance.

```ts
subscription.unsubscribe();
```

:::

---

# Update Documents

The update command modifies documents in a collection. A single update command can contain multiple update statements.

:::div{class="admonitions"}

**Supported Update Operations**

- [$set](https://www.mongodb.com/docs/v4.4/reference/operator/update/set/)
  - When accessing arrays use `ratings[0].rating` instead of `ratings.0.rating`
  - [$(update)](https://www.mongodb.com/docs/v4.4/reference/operator/update/positional/)
    - Update with Multiple Array Matches is not supported. [Example](https://www.mongodb.com/docs/v4.4/reference/operator/update/positional/#update-with-multiple-array-matches)
- [$unset](https://www.mongodb.com/docs/v4.4/reference/operator/update/unset/)
- [$push](https://www.mongodb.com/docs/v4.4/reference/operator/update/push/)
- [$pull](https://www.mongodb.com/docs/v4.4/reference/operator/update/pull/)

:::

---

## .updateOne

Update a document using the given filter.

**Definition**

```ts
collection.updateOne(criteria: RawObject, update: UpdateActions): Promise<UpdateResult>
```

**Example**

```ts
const result = await users.updateOne({ name: "John" }, { email: "john.doe@fixture.none" });
```

**Types**

```ts
type UpdateResult = {
  acknowledged: boolean;
  matchedCount: number;
  modifiedCount: number;
  exceptions: Error[];
};
```

---

## .updateMany

Updates all documents that match the specified filter for a collection.

**Definition**

```ts
collection.updateMany(criteria: RawObject, update: UpdateOperations): Promise<UpdateResult>;
```

**Example**

```ts
const result = await users.updateMany({ views: { $lt: 10 } }, { views: 10 });
```

**Types**

```ts
type UpdateResult = {
  acknowledged: boolean;
  matchedCount: number;
  modifiedCount: number;
  exceptions: Error[];
};
```

---

## .replaceOne

Replaces a single document within the collection based on the filter.

**Definition**

```ts
collection.replaceOne(criteria: RawObject, document: D): Promise<UpdateResult>;
```

**Example**

```ts
const result = await users.replaceOne(
  {
    name: "John"
  },
  {
    name: "Dave",
    email: "dave@doe.com",
    views: 0
  }
);
```

**Types**

```ts
type UpdateResult = {
  acknowledged: boolean;
  matchedCount: number;
  modifiedCount: number;
  exceptions: Error[];
};
```

---

# Remove Documents

The remove command deletes documents in a collection.

---

## .remove

Removes documents from a collection.

**Definition**

```ts
collection.remove(criteria: RawObject, options?: RemoveOptions): Promise<RemoveResult>;
```

**Example**

```ts
const result = await users.remove({ email: { $regex: /$@doe/i } });
```

**Types**

```ts
type RemoveResult = {
  acknowledged: boolean;
  deletedCount: number;
  exceptions: Error[];
};
```
