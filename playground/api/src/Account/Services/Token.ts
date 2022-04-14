import { customAlphabet } from "nanoid";

import { config } from "../../Config";
import { accounts } from "../Model";

const generateToken = customAlphabet(config.auth.token.letters, config.auth.token.length);

export async function createAccountToken(type: "email" | "sms" | "console", accountId: string) {
  const token = generateToken();
  await accounts.updateOne({ id: accountId }, { $set: { token } });
  switch (type) {
    case "email": {
      throw new Error("Email is not yet supported");
    }
    case "sms": {
      throw new Error("SMS is not yet supported");
    }
    case "console": {
      console.log("Token:", token);
      break;
    }
  }
  return token;
}

export async function removeAccountToken(accountId: string) {
  return accounts.updateOne({ id: accountId }, { $set: { token: "" } });
}
