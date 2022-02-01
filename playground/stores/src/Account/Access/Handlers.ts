import { permissionGranted, PermissionHandler } from "@valkyr/access";

import { getAccountAttributes } from "./Attributes";
import type { Permissions } from "./Role";

export function read(): PermissionHandler<Permissions["account"]["read"]> {
  return (flag) => permissionGranted(getAccountAttributes(flag));
}
