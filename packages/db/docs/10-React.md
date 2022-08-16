---
title: React
sections: ["Database"]
---

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
