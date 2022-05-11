import { ModelDefinition } from "@valkyr/db";

export class Database {
  static for(definitions: ModelDefinition[]) {
    return definitions.map((definition) => {
      definition.model.$collection = definition.collection;
      return {
        provide: definition.name ?? definition.model,
        useFactory: () => definition.model
      };
    });
  }
}
