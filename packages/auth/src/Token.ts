export type TokenData = {
  auditor: string;
};

export type Token<Data extends TokenData = TokenData> = {
  decode(value: string): Promise<Data>;
};
