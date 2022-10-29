import { ModelClass } from "../model";

export type Registrars = {
  name: string;
  model: ModelClass;
  indexes?: Index[];
};

type Index = [string, IDBIndexParameters?];
