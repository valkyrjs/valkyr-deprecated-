import { config } from "@App/Config";

import { Socket } from "./Socket";

export const socket = new Socket(config.api.endpoint.socket);
