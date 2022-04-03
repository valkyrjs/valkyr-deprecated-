import { Socket } from "@valkyr/socket";

import { config } from "../Config";

export const socket = new Socket({
  uri: config.socket
});
