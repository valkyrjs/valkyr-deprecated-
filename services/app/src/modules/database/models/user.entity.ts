import { Document } from "@valkyr/db";

export type User = Document & {
  name: string;
  email: string;
  posts: number;
  createdAt: number;
};
