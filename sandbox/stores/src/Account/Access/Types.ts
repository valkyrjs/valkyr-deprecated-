export type Permissions = {
  account: {
    setAlias: boolean;
    setEmail: boolean;
    setName: boolean;
    read: Filters;
    close: boolean;
  };
};

export type Filters = {
  owner: number;
  public: number;
};
