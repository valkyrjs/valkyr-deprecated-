const fs = require("fs");
const path = require("path");

const docs = [];
const packagesPath = path.resolve(__dirname, "..", "packages");

const packages = fs.readdirSync(packagesPath);
for (const package of packages) {
  const hasDocs = fs.existsSync(path.join(packagesPath, package, "docs"));
  if (hasDocs) {
    docs.push(package)
  }
}

module.exports = docs;