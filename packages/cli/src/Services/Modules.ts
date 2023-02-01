export function getEnabledModules(): string[] {
  return [];
}

export type ModuleEntry = {
  name: string;
  enabled: boolean;
  events: {
    alias: string;
    path: string;
  };
  dependencies: Record<string, string>;
};
