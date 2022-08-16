---
title: Collections
sections: ["Database"]
---

A collection is a grouping of `@valkyr/db` documents. Documents within a collection can have different fields. A collection is the equivalent of a table in a relational database system.

In `@valkyr/db` there is no central `database` instance. Instead we simply create a collection and assign it to a variable of our choosing. A collection will automatically resolve and persist data when performing operations against it, so no preload step is required when interacting with a collection.

**Examples**

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

**@valkyr/db** provides the following methods of inserting `documents` into a collection:

## .insertOne

Inserts a single document and returns a insert result.

**Examples**

```ts
const result = await users.insertOne({ name: "John", email: "john@doe.com", views: 0 });
```

**Types**

:::div{class="admonitions"}

Returns `result` > `InsertResult | InsertException`

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

**References**

- MongoDB [.insertOne()](https://www.mongodb.com/docs/v5.0/reference/method/db.collection.insertOne/#mongodb-method-db.collection.insertOne)

:::div{class="admonitions yellow"}

**@valkyr/db** currently does not support `writeConcern` argument.

:::

---

## .insertMany

Inserts multiple documents and returns a insert many result.

**Example:**

```ts
const result = await users.insertMany([
  { name: "John", email: "john@doe.com", views: 0 },
  { name: "Jane", email: "jane@doe.com", views: 0 }
]);
```

**Types**

:::div{class="admonitions"}

Returns `result` > `InsertManyResult`

```ts
type InsertManyResult = {
  acknowledged: boolean;
  insertedIds: string[];
  exceptions: Error[];
};
```

:::

**References**

- MongoDB [.insertMany()](https://www.mongodb.com/docs/v5.0/reference/method/db.collection.insertMany)

:::div{class="admonitions yellow"}

**@valkyr/db** currently does not support `writeConcern` and `ordered` arguments.

:::

---

# Query Documents

**@valkyr/db** provides the following methods of querying `documents` in a collection:

Additional information can be found through [mongodb](https://www.mongodb.com/docs/v5.0/tutorial/query-documents) documentation.

**@valkyr/db** uses [mingo](https://github.com/kofrasa/mingo) as the query driver, an excellent solution brining mongodb queries to TypeScript. Please refer to [differences from mongodb](https://github.com/kofrasa/mingo#differences-from-mongodb) to familiarize yourself with query differences.

## .findById

Returns `document` that satisfies the specified `id`.

```ts
async function findById(id: string): Promise<Document | undefined>;
```

This is a specialized method which reads the record straight from the document `storage` map. This is the most optimized method for fetching a known document and is the only query method that does not utilize [mingo](https://github.com/kofrasa/mingo).

**Examples**

```ts
const user = await users.findById("xyz");
```

---

## .find

Returns documents that satisfies the specified query `criteria` and `options` on the collection.

```ts
async function find(criteria: RawObject = {}, options?: Options): Promise<Document[]>;
```

**Examples**

```ts
const users = await users.find({ name: "John" });
```

**Types**

:::div{class="admonitions"}

Argument `options`

```ts
type Options = {
  sort?: {
    [key: string]: 1 | -1;
  };
  skip?: number;
  limit?: number;
};
```

:::

**References**

- MongoDb [.find()](https://www.mongodb.com/docs/v4.4/reference/method/db.collection.find)

---

## .findOne

Returns one `document` that satisfies the specified query `criteria` and `options` on the collection. If multiple documents satisfy the query, this method returns the first `document` according to the natural order which reflects the order of documents on the disk. In capped collections, natural order is the same as insertion order. If no `document` satisfies the query, the method returns `undefined`.

```ts
async function findOne(criteria: RawObject = {}, options?: Options): Promise<Document | undefined>;
```

**Examples**

```ts
const user = await users.findOne({ name: "John" });
```

**Types**

:::div{class="admonitions"}

Argument `options`

```ts
type Options = {
  sort?: {
    [key: string]: 1 | -1;
  };
  skip?: number;
  limit?: number;
};
```

:::

**References**

- MongoDb [.findOne()](https://www.mongodb.com/docs/v4.4/reference/method/db.collection.findOne)

---

## .count

Returns the count of documents that would match a `find()` query for the collection. The `collection.count()` method does not perform the `find()` operation but instead counts and returns the number of results that match a query.

```ts
async function count(criteria: RawObject = {}): Promise<number>;
```

**Examples**

```ts
const userCount = await users.count({ email: { $regex: /@test\.com/i } });
```

---

## .query

Selects documents in a collection that satisfies the specified query `criteria` and returns a cursor to the selected documents.

```ts
function query(criteria: RawObject = {}): Cursor;
```

**Examples**

```ts
const cursor = await users.query({ email: { $regex: /john@/i } });
// perform additional filtering behavior on the cursor
const users = cursor.all();
```

---

# Observe Documents

Subscriptions provides a observation layer for `.find` and `.findOne` type data filtering and wraps it in a `rxjs` observer instance. Any time the collection sees changes to data matching the observation filter the observer subscription is notified and forwards the changes.

## .observe

Returns observable which observes documents that satisfies the specified query `criteria` and `options` on the collection.

```ts
function observe(criteria: RawObject = {}, options?: Options): Observable<Document[]>;
```

**Examples**

```ts
const subscription = users.observe({ name: "John" }).subscribe((users) => {
  // list of users with name John
});
```

## .observeOne

Returns observable which observes document that satisfies the specified query `criteria` on the collection. If no `document` satisfies the query, the observer returns `undefined`.

```ts
function observeOne(criteria: RawObject = {}): Observable<Document | undefined>;
```

**Examples**

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

See [mongodb update documents](https://www.mongodb.com/docs/v5.0/tutorial/update-documents)

## .updateOne

Update a document using the given filter.

**Examples**

```ts
const result = await users.updateOne({ name: "John" }, { email: "john.doe@fixture.none" });
```

**Types**

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

**References**

- MongoDb [.updateOne()](https://www.mongodb.com/docs/v4.4/reference/method/db.collection.updateOne)

:::div{class="admonitions yellow"}

**@valkyr/db** currently does not support the third update argument as documented in mongodb.

:::

---

## .updateMany

Update a documents matching the given filter.

**Examples**

```ts
const result = await users.updateMany({ views: { $lt: 10 } }, { views: 10 });
```

**Types**

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

---

## .replaceOne

---

# Remove Documents

## .delete

---
