const fs = require("fs");
const path = require("path");

const IMPORT_REGEXP = /^((import|export)[^';]*(from)?"(\.|(\.\.)+)[^';]*)"/g;
const JUST_ADD_AN_EXTENSION = '$1.js"';
const ADD_INDEX_FILE = '$1/index.js"';
const JS_EXT = ".js";

function fixImportsAtFolder(rootPath: string) {
  for (const entry of fs.readdirSync(rootPath)) {
    const entryPath = path.join(rootPath, entry);
    if (entry.endsWith(JS_EXT)) {
      fixImportsAtFile(entryPath);
    } else {
      const extName = path.extname(entry);
      if (!extName) {
        const stat = fs.statSync(entryPath);
        if (stat.isDirectory()) {
          fixImportsAtFolder(entryPath);
        }
      }
    }
  }
}

function fixImportsAtFile(filePath: string) {
  const content = fs.readFileSync(filePath).toString("utf8");
  const lines = content.split("\n");

  const fixedLines = lines.map((l: string) => {
    if (!l.match(IMPORT_REGEXP)) {
      return l;
    }

    const [_, importPath] = l.split('"');
    const fullPath = path.join(filePath, "..", importPath);
    const exists = fs.existsSync(fullPath);
    if (exists === false) {
      return l.replace(IMPORT_REGEXP, JUST_ADD_AN_EXTENSION);
    }

    const stat = fs.statSync(fullPath);
    const isDirectory = stat.isDirectory();
    if (isDirectory === true) {
      return l.replace(IMPORT_REGEXP, ADD_INDEX_FILE);
    }

    return l;
  });

  fs.writeFileSync(filePath, fixedLines.join("\n"));
}

fixImportsAtFolder(path.join(process.cwd(), "esm"));
