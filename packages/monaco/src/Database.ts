import { Document, IndexedDatabase } from "@valkyr/db";

import type { PackageJSON } from "./Resolver/Unpkg.Json.js";

export const db = new IndexedDatabase<Collections>({
  name: "valkyr:packages",
  version: 1,
  registrars: [
    {
      name: "packages",
      indexes: [["name", { unique: true }]]
    },
    {
      name: "files",
      indexes: [["name"], ["path"]]
    }
  ]
});

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Collections = {
  packages: Package;
  files: File;
};

export type Package = Document<PackageJSON>;

export type File = Document<{
  name: string;
  path: string;
  body: string;
}>;
