import { EventEntry, generateEvents } from "../generators/events";
import { generateTypes, TypeEntry } from "../generators/types";
import { program } from "../program";
import { readFile, writeFile } from "../services/files";
import { getJSON } from "../services/json";
import { ModuleEntry } from "../services/modules";
import { getRelativePath, getTemplatePath } from "../services/paths";
import { getValkyrConfiguration, ProjectConfiguration } from "../services/project";

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
