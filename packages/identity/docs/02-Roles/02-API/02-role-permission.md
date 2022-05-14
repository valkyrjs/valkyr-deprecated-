---
id: roles-api-role-permission
title: Role Permission
sidebar_label: Role Permission
slug: /roles-api-role-permission
---

## Role Permission Class

| Attribute  | Type        | Description                              |
| ---------- | ----------- | ---------------------------------------- |
| roleId     | string      | Unique primary role identifier           |
| operations | Operation[] | List of operations to perform on .commit |

## Role Permission Methods

```ts
import { RolePermission } from "@valkyr/access";

const permission = new RolePermission();
```

### Grant

Grant specific action access to a permission resource.

```ts title="role.grant<Data = unknown>(resource: Resource, action: Action, data?: Data): RolePermission"
permission.grant("employee", "create");
```

:::note

When `data` is not provided the permission value defaults to `true`

:::

### Deny

Deny access to a resource or a specific action within the resource.

```ts title="role.deny<Data = unknown>(resource: Resource, action?: Action): RolePermission"
permission.deny("employee", "create");
```

:::note

When `action` is not provided all permissions will be removed for the permission.

:::

### Commit

Commit the new permission operations to the persistent storage solution.

```ts title="commit(): Promise<void>"
await permission.commit();
```

:::info

`grant` and `deny` are chainable which means you can string together a commit in a single chain.

```ts
await permission
  .grant("employee", "create")
  .grant("employee", "update", 0)
  .grant("employee", "read", 0)
  .grant("employee", "remove")
  .commit();
```

:::

## Types

### Operation

Operation type reference

```ts
type Operation<Resource, Action, Data = unknown> =
  | SetOperation<Resource, Action, Data>
  | UnsetOperation<Resource, Action>;

type SetOperation<Resource, Action, Data> = {
  type: "set";
  resource: Resource;
  action: Action;
  data?: Data;
};

type UnsetOperation<Resource, Action> = {
  type: "unset";
  resource: Resource;
  action?: Action;
};
```
