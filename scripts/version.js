const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const pkgsDir = path.resolve(root, "packages");
const version = process.argv[process.argv.indexOf("--version") + 1]

const pkgs = fs.readdirSync(pkgsDir);
for (const pkg of pkgs) {
  const pkgDir = path.join(pkgsDir, pkg, "package.json");
  const json = [];
  for (const line of fs.readFileSync(pkgDir, "utf-8").split("\n")) {
    if (line.includes("version")) {
      json.push(line.replace("0.0.0", version));
    } else if (line.includes("workspace:*")) {
      json.push(line.replace("workspace:*", version));
    } else if (line.includes("main")) {
      json.push("  \"main\": \"./dist/index.js\",\n  \"types\": \"./dist/index.d.ts\",");
    } else {
      json.push(line);
    }
  }
  fs.writeFileSync(pkgDir, json.join("\n"));
}