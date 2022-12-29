import { Document } from "@valkyr/db";

export type Post = Document & {
  body: string;
  likes: number;
  comments: number;
  createdBy: string;
  createdAt: number;
};
