---
id: quick-start
title: Quick Start
sidebar_label: Quick Start
slug: /quick-start
---

# Quick Start

Creating an access group.

```ts
import { Access, container } from "@valkyr/access";

class AccountAccess extends Access<Permissions> {}

export async function getAccountAccess(accountId: string, db = container.get("Database")) {
  return new AccountAccess(await db.getPermissions(accountId, accountId));
}
```
