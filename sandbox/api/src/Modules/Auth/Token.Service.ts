import { customAlphabet } from "nanoid";

import { collection } from "../../Collections";
import { config } from "../../Config";

const generateToken = customAlphabet(config.auth.token.letters, config.auth.token.length);

/*
 |--------------------------------------------------------------------------------
 | Create
 |--------------------------------------------------------------------------------
 */

export async function create(type: "email" | "sms" | "console", accountId: string) {
  const token = generateToken();
  await collection.accounts.updateOne({ accountId }, { $set: { token } });
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

/*
 |--------------------------------------------------------------------------------
 | Delete
 |--------------------------------------------------------------------------------
 */

export async function remove(accountId: string) {
  return collection.accounts.updateOne({ accountId }, { $set: { token: "" } });
}
