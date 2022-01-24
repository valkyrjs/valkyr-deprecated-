import { container, TokenData } from "@valkyr/auth";
import decode from "jwt-decode";

type Data = TokenData;

container.set("Token", {
  async decode(value: string) {
    return decode<Data>(value);
  }
});
