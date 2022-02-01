const fs = require("fs");
const path = require("path");

const packagesDir = path.resolve(__dirname, "packages");
const version = process.argv[process.argv.indexOf("--version") + 1]

const packages = fs.readdirSync(packagesDir);
for (const package of packages) {
  const packageDir = path.join(packagesDir, package, "package.json");
  const json = [];
  for (const line of fs.readFileSync(packageDir, "utf-8").split("\n")) {
    if (line.includes("version")) {
      json.push(line.replace("0.0.0", version));
    } else if (line.includes("*")) {
      json.push(line.replace("*", version));
    } else {
      json.push(line);
    }
  }
  fs.writeFileSync(packageDir, json.join("\n"));
}