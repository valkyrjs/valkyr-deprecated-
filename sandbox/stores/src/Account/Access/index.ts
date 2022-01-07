import { createPermission } from "@valkyr/access";

import { read } from "./Queries";
import { setup } from "./Setup";
import { Permissions } from "./Types";

export const access = {
  setup,
  for: createPermission<Permissions>(),
  read
};
