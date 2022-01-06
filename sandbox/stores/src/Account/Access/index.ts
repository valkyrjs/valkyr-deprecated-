import { createPermission } from "@valkyr/access";

import { read } from "./Queries";
import { setup } from "./Setup";
import { Permissions } from "./Types";

export default {
  setup,
  for: createPermission<Permissions>(),
  read
};
