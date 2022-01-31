import { container, Role } from "@valkyr/access";

export type Permissions = {
  account: {
    setAlias: boolean;
    setEmail: boolean;
    setName: boolean;
    read: number; // bitflag value
    close: boolean;
  };
};

export async function getAccountRole(roleId: string, db = container.get("Database")) {
  const data = await db.getRole<Permissions>(roleId);
  if (data) {
    return new Role<Permissions>({
      ...data,
      permissions: getPermissions(data.permissions)
    });
  }
}

function getPermissions({ account }: Partial<Permissions>): Permissions {
  return {
    account: {
      setAlias: account?.setAlias === true,
      setName: account?.setAlias === true,
      setEmail: account?.setAlias === true,
      read: account?.read ?? 0,
      close: account?.close === true
    }
  };
}
