export type Registrars = {
  name: string;
  indexes?: Index[];
};

type Index = [string, IDBIndexParameters?];
