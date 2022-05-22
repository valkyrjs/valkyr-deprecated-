import { IdentityData, IdentityProviderStore } from "../IdentityStorage";

const STORAGE_NAME = "identities";

const storage: Record<string, IdentityData> = JSON.parse(localStorage.getItem(STORAGE_NAME) || "{}");

export const localIdentityStorage: IdentityProviderStore = {
  async set(alias: string, data: IdentityData): Promise<boolean> {
    storage[alias] = data;
    persistStorage();
    return true;
  },
  async get(alias: string): Promise<IdentityData | undefined> {
    return storage[alias];
  }
};

function persistStorage() {
  localStorage.setItem(STORAGE_NAME, JSON.stringify(storage));
}
