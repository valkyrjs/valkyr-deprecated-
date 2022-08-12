---
title: DB
sections: ["App"]
---

Work in progress ...

## Differences

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
