---
id: role-permissions
title: Permissions
sidebar_label: Permissions
slug: /role-permissions
---

## Permissions

In our previous section we learned about roles, and how to create them. Next we need to look at how to create permissions which we use to perform access lookups against.

### Create Permission

Create a re-usable permission handler for your [permission template](roles-overview#permission-template).

```ts title="createPermission(): Function"
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

### Permission Granted

When you want to generate a permission granted object you can do so directly.

```ts title="permissionGranted(attributes?: Attributes): Granted"
import { permissionGranted } from "@valkyr/access";

const permission = permissionGranted(new Attributes(EMPLOYEE_FLAGS, 0));
```

:::info

See [Attributes](#attributes) for attribute details.

:::

### Permission Denied

When you want to generate a permission denied object you can do so directly.

```ts title="permissionGranted(message?: string): Denied"
import { permissionDenied } from "@valkyr/access";

const permission = permissionDenied("Access denied, check your credentials!");
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

## Handlers

When performing permission checks we will in many circumstances want to define how permission data is intepreted and validated. To do so we create permission handlers.

These are custom methods which you provide to the [can](#can) method of a permission object.

Lets start by defining a custom permission handler:

```ts title="Permission Template"
type Permissions = {
  employee: {
    remove: {
      onProbationEnded: boolean;
    };
  };
};
```

```ts
function removeEmployee(employee: Employee): PermissionHandler<Permissions["employee"]["remove"]> {
  return ({ onProbationEnded }) => {
    if (onProbationEnded === false && employee.hasFinishedProbation === true) {
      return permissionDenied("You cannot remove a employee who has finished their probation period.");
    }
    return permissionGranted();
  };
}
```

We can assign this custom handler to our permission check:

```ts
const employee = await getEmployee("employeeId");
const permission = await access.for("companyId", "employeeId").can("remove", "employee", removeEmployee(employee));
if (permission.granted === false) {
  throw new Error(permission.message);
}
// yay, they have permission to remove the employee
```

## Types

```ts
export type PermissionHandler<Props extends Value = any> = (props: Props) => Granted | Denied;

export type Granted<Attributes extends BaseAttributes = BaseAttributes> = {
  granted: true;
  attributes?: Attributes;
  filter<Data extends Record<string, unknown>>(data: Data | Data[], filter?: string): Partial<Data> | Partial<Data>[];
};

export type Denied = {
  granted: false;
  message: string;
};
```
