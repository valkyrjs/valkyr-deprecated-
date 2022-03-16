export type Account = {
  id: string;
  status: Status;
  alias: string;
  name: Name;
  email: string;
  token: string;
};

type Status = "onboarding" | "active" | "closed";

type Name = {
  family: string;
  given: string;
};
