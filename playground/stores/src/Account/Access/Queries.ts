import { permissionGranted, Query } from "@valkyr/access";

import { getAccountAttributes } from "./Attributes";
import type { Permissions } from "./Role";

export const read: Query<never, Permissions["account"]["read"]> = () => {
  return (filter) => permissionGranted(getAccountAttributes(filter));
};
