import { Collection } from "../collection";
import { MemoryStorage } from "./memory.storage";
import { Registrars } from "./registrars";

export class MemoryDatabase {
  register(registrars: Registrars[]): void {
    for (const { name, model } of registrars) {
      model.$collection = new Collection(name, new MemoryStorage(name));
    }
  }
}
