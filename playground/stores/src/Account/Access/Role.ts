import { container, Role } from "@valkyr/access";

export type Permissions = {
  account: {
    setAlias: boolean;
    setEmail: boolean;
    setName: boolean;
    read: Filters;
    close: boolean;
  };
};

export type Filters = {
  owner: number;
  public: number;
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
      read: {
        owner: account?.read?.owner ?? 0,
        public: account?.read?.public ?? 0
      },
      close: account?.close === true
    }
  };
}
