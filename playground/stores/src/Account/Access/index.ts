import { createPermission } from "@valkyr/access";

import { read } from "./Handlers";
import { Permissions } from "./Role";
import { setup } from "./Setup";

export const access = {
  setup,
  for: createPermission<Permissions>(),
  read
};
