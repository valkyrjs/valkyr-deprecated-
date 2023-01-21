import fs from "fs";
import path from "path";

const IMPORT_REGEXP = /^((import|export)[^';]*(from)?"(\.|(\.\.)+)[^';]*)"/g;
const JUST_ADD_AN_EXTENSION = "$1.js\"";
const ADD_INDEX_FILE = "$1/index.js\"";
const JS_EXT = ".js";

function fixImportsAtFolder(rootPath) {
  const entries = fs.readdirSync(rootPath);
  entries.forEach((entry) => {
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
  });
}

function fixImportsAtFile(filePath) {
  const content = fs.readFileSync(filePath).toString("utf8");
  const lines = content.split("\n");

  const fixedLines = lines.map((l) => {
    if (l.match(IMPORT_REGEXP) === null) {
      return l;
    }
    
    const [_, importPath] = l.split("\"");
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

fixImportsAtFolder(path.join(process.cwd(), "dist"));
