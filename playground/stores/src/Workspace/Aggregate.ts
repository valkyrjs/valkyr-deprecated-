import type { Member } from "../Member";

export type Workspace = {
  id: string;
  name: string;
  members: Member["id"][];
};
