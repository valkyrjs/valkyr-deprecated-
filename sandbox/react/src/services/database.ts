import { IndexedDatabase } from "@valkyr/db";

export const db = new IndexedDatabase("valkyr", 1, console.log);
