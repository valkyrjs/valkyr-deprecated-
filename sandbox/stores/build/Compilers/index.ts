import * as fs from "fs";
import * as path from "path";

import { getAccess, getAccessExports, getAccessImports } from "./Access";
import { getEventExports, getEventImports, getEvents } from "./Events";
import { getGeneral, getGeneralExports } from "./General";

export async function stores(cwd: string) {
  const exports = fs.readFileSync(path.join(process.cwd(), "build/Templates/index"), "utf-8");
  const src = path.resolve(cwd);

  const access = await getAccess(src);
  const events = await getEvents(src, src);
  const general = await getGeneral(src);

  fs.writeFileSync(
    path.resolve(src, "index.ts"),
    exports
      .replace("$access", getAccessImports(src, access) + getAccessExports(access))
      .replace("$events", getEventImports(events) + getEventExports(events))
      .replace("$general", getGeneralExports(general))
  );
}
