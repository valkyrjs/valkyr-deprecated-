import fs from "fs-extra";
import path from "path";

export function getValkyrConfiguration(): ProjectConfiguration {
  const hasPackage = fs.existsSync(path.join(process.cwd(), "package.json"));
  if (hasPackage === false) {
    throw new Error("No package.json found");
  }
  const pkg = fs.readJsonSync(path.join(process.cwd(), "package.json"));
  if (pkg.valkyr === undefined) {
    throw new Error("No valkyr configuration found in package.json");
  }
  return pkg.valkyr;
}

export type ProjectConfiguration = {
  name: string;
  input: {
    adapter: "fs";
    location: string;
  };
  output: {
    api: string;
    app: string;
  };
};
