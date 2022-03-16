import { customAlphabet } from "nanoid";

import { collection } from "../../../Collections";
import { config } from "../../../Config";

const generateToken = customAlphabet(config.auth.token.letters, config.auth.token.length);

export async function createAccountToken(type: "email" | "sms" | "console", accountId: string) {
  const token = generateToken();
  await collection.accounts.updateOne({ id: accountId }, { $set: { token } });
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
  return collection.accounts.updateOne({ id: accountId }, { $set: { token: "" } });
}
