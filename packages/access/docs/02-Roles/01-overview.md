---
id: roles-overview
title: Overview
sidebar_label: Overview
slug: /roles-overview
---

# Overview

Our implementation of access control is centered around a permission template which can be used to create access roles. Since permission are tied to code we want to define what permission look like, but we want to be dynamic in how the template content is put together into various assignable entities.

## Permission Template

A permission template is simply used as type inference to more easily intellisense the available values when performing access control reads and modifications.

Lets continue our tutorial by first creating a permission template:

```ts
export type Permissions = {
  /**
   * Permissions within the employee category this role has.
   */
  employee: {
    /**
     * Can this role create new employees?
     */
    create: boolean;

    /**
     * Which employee attributes can this role update?
     */
    update: number; // bitflag value

    /**
     * Which employee attributes can this role view?
     */
    read: number; // bitflag value

    /**
     * Can this role remove an employee?
     */
    remove: boolean;
  };
};
```

## Role Setup

The next example shows how you would use the above permissions to map it to a role:

```ts
import { container, Role } from "@valkyr/access";

export async function getCompanyRole(roleId: string, db = container.get("Database")) {
  const data = await db.getRole<Permissions>(roleId);
  if (data) {
    return new Role<Permissions>({
      ...data,
      permissions: getPermissions(data.permissions)
    });
  }
}

function getPermissions({ employee }: Partial<Permissions>): Permissions {
  return {
    employee: {
      create: employee?.create === true,
      update: employee?.update ?? 0,
      remove: employee?.remove === true
    }
  };
}
```

Above we see a `getCompanyRole` method which simply takes a role id a resolves it against the injected database provider. Any value coming out of this method is a role with its permissions mapped to our `Permissions` type.

The `getPermissions` method takes a partial permissions object and returns a non partial version of the same object. This ensures that we have default base values ensured in case they are not available in the database.

Next we want to be able to retrieve someones permissions so we can do some actual access control checks, to do this we need to create a permission resolver.
