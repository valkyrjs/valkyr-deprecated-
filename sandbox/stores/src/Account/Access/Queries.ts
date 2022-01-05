import { Permission, Query } from "@valkyr/access";

import { AccountAttributes } from "./Attributes";
import type { Permissions } from "./Types";

export const read: Query<never, Permissions["account"]["read"]> = () => {
  return (filter) => new Permission({ granted: true, attributes: new AccountAttributes(filter) });
};
