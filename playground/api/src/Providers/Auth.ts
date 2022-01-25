import { container, TokenData } from "@valkyr/auth";
import * as jwt from "jsonwebtoken";

import { config } from "../Config";

type Data = TokenData;

container.set("Token", {
  async decode(value: string) {
    return jwt.verify(value, config.auth.secret) as Data;
  }
});
