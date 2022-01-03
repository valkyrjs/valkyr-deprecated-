---
id: roles-api-role
title: Role
sidebar_label: Role
slug: /roles-api-role
---

## Role Class

| Attribute   | Type     | Description                                             |
| ----------- | -------- | ------------------------------------------------------- |
| roleId      | string   | Unique primary role identifier                          |
| name        | string   | Human readable role identifier                          |
| settings    | object   | Dynamic settings useful for UI descriptors and the like |
| permissions | object   | Permission template values                              |
| members     | string[] | List of member ids that is assigned to the role         |

:::note

A `member` should be a entity of a specific subset of data.

As an example `accountA` should be `memberX` of `groupZ`. When we fetch permissions, we pull multiple roles that `memberX` is assigned to and combine them into one permission object. So its vital to keep member ids confined to the specific group or groups that they belong.

:::

## Role Methods

```ts
import { Role } from "@valkyr/access";

const role = new Role();
```

### Grant

Wrapper for [Role Permission](roles-api-role-permission) [grant](roles-api-role-permission#grant) method.

```ts title="role.grant<Data = unknown>(resource: Resource, action: Action, data?: Data): RolePermission"
role.grant("employee", "create");
```

### Deny

Wrapper for [Role Permission](roles-api-role-permission) [deny](roles-api-role-permission#deny) method.

```ts title="role.deny(resource: Resource, action?: Action): RolePermission"
role.deny("employee", "create");
```

:::note

When `action` is not provided all employee permissions will be removed.

:::

### Add Member

Add a new member to the role.

```ts title="role.addMember(memberId: string): Promise<void>"
role.addMember("memberId");
```

### Delete Member

Remove a member from the role.

```ts title="role.delMember(memberId: string): Promise<void>"
role.delMember("memberId");
```

### JSON

Get the role as a JSON object.

```ts title="role.toJSON(): object"
role.toJSON();
```
