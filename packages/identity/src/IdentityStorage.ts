export interface IdentityProviderStore {
  set(alias: string, data: IdentityStorageSchema): Promise<boolean>;
  get(alias: string): Promise<IdentityStorageSchema | undefined>;
}

export type IdentityStorageSchema = {
  id: string;
  alias: string;
  data: string;
  keys: PublicIdentityKeys;
  accessKey?: string;
};

export type PublicIdentityKeys = {
  signature: string;
  vault: string;
};
