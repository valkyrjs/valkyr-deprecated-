import * as fs from "fs";
import * as path from "path";

import { stores } from "./Compilers";

(async function () {
  const src = path.resolve(process.cwd(), "src");
  await clean(src);
  await stores(src);
})();

async function clean(src: string) {
  try {
    await fs.promises.unlink(path.join(src, "index.ts"));
  } catch (err: any) {
    if (err.code !== "ENOENT") {
      throw err;
    }
  }
}
