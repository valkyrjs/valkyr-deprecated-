---
id: permissions
title: Permissions
sidebar_label: Permissions
slug: /permissions
---

# Permissions

In our previous section we learned about roles, and how to create them. Next we need to look at how to create permissions which we use to perform access lookups against.

In our example we create an access object with a `for` key that we assign a permission resolver to:

```ts
import { createPermission } from "@valkyr/access";

export const access = {
  for: createPermission<Permission>()
};
```

Now that we have our company access object we can use it to check incoming requests:

```ts
const permission = await access.for("companyId", "employeeId").can("create", "employee");
if (permission.granted === false) {
  throw new Error(permission.message);
}
// yay, they have permission to create a new employee
```

## Attributes

With our access control package we provide an attributes concept which allows you take a list of attribute `flags` and compress them into a single number. Attributes are great to compress a larger object into a small representation and use that to confirm a true or false access value.

To achieve this we use a concept called bitflags, lets introduce this concept with some practical examples:

```ts
import { Attributes } from "@valkyr/access";

const EMPLOYEE_FLAGS = {
  firstName: 1 << 0,
  lastName: 1 << 1,
  email: 1 << 2,
  salary: 1 << 3
};

const attributes = new Attributes(EMPLOYEE_FLAGS);
```

The above example we are creating a empty attributes instance, next we want to enable some flags for this new instance:

```ts
attributes.enable(["firstName", "lastName", "email"]);
```

The attributes instance has now enabled access to the `firstName`, `lastName`, and `email` attributes for a user. Now if we remember our example role in the previous section we had `employee.update` and `employee.read` expecting a bitflag number value.

Now we can grant the newly created attributes to a role:

```ts
const role = await db.getRole("roleId");
await role.grant("employee", "update", attributes.toNumber()).commit();
```

With this update the role we just updated now allows anyone who is assigned to this role to update an employee `firstName`, `lastName`, and `email` attributes.
