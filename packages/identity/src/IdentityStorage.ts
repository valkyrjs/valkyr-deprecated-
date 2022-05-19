export interface IdentityProviderStore {
  set(alias: string, data: IdentityData): Promise<boolean>;
  get(alias: string): Promise<IdentityData | undefined>;
}

export type IdentityData = {
  alias: string;
  identity: string;
  accessKey?: string;
};
