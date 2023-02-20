import { EventEntry, generateEvents } from "../Generators/Events.js";
import { generateTypes, TypeEntry } from "../Generators/Types.js";
import { program } from "../Program.js";
import { readFile, writeFile } from "../Services/Files.js";
import { getJSON } from "../Services/JSON.js";
import { ModuleEntry } from "../Services/Modules.js";
import { getRelativePath, getTemplatePath } from "../Services/Paths.js";
import { getValkyrConfiguration, ProjectConfiguration } from "../Services/Project.js";

program
  .command("generate")
  .description("Consumes project configuration and generates application code")
  .action(async () => {
    const { input, output } = getValkyrConfiguration();
    switch (input.adapter) {
      case "fs": {
        generateProjectFiles(input.location, output);
      }
    }
  });

function generateProjectFiles(configPath: string, output: ProjectConfiguration["output"]) {
  generateProjectTypes(configPath, output);
  generateProjectEvents(configPath, output);
}

function generateProjectTypes(configPath: string, output: ProjectConfiguration["output"]) {
  const config = getJSON<TypeEntry[]>(getRelativePath(configPath, "types.json"));
  const events = generateTypes(readFile(getTemplatePath("types.template")), config);
  writeFile(getRelativePath(output.api, "types.ts"), events);
}

function generateProjectEvents(configPath: string, output: ProjectConfiguration["output"]) {
  writeFile(
    getRelativePath(output.api, "events.ts"),
    generateEvents(
      getJSON<EventEntry[]>(getRelativePath(configPath, "events.json")),
      getJSON<ModuleEntry[]>(getRelativePath(configPath, "modules.json"))
    )
  );
}
