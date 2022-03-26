export type Workspace = {
  id: string;
  name: string;
  members: Member[];
};

export type Member = {
  id: string;
  accountId: string;
};
