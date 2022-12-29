import { Document } from "@valkyr/db";

export type Cursor = Document & {
  timestamp: string;
};
