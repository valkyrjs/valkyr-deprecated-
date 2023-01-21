import { db } from "../../services/database";

export const account = db.collection<Account>("accounts");

export async function insertAccount(document: Account): Promise<void> {
  await account.insertOne(document);
}

export async function findAccountById(id: string): Promise<Account | null> {
  return account.findOne({ id });
}

export async function findAccountByEmail(email: string): Promise<Account | null> {
  return account.findOne({ email });
}

export type Account = {
  id: string;
  email: string;
  password: string;
};
