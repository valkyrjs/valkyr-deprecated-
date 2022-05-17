import { Ledger } from "@valkyr/ledger";

import { ComponentSettings, Layout } from "../Types";
import type { Auditor } from "../Workspace";
import type { State, TemplateComponent } from "./Aggregate";

export const events = {
  created: Ledger.createEvent<Created>("TemplateCreated"),
  nameSet: Ledger.createEvent<NameSet>("TemplateNameSet"),
  removed: Ledger.createEvent<Removed>("TemplateRemoved"),
  components: {
    added: Ledger.createEvent<ComponentAdded>("TemplateComponentAdded"),
    settingSet: Ledger.createEvent<ComponentSettingSet>("TemplateComponentSettingSet"),
    layoutSet: Ledger.createEvent<ComponentLayoutSet>("TemplateComponentLayoutSet"),
    removed: Ledger.createEvent<ComponentRemoved>("TemplateComponentRemoved")
  }
};

export type Created = Ledger.Event<"TemplateCreated", Pick<State, "workspaceId" | "name" | "color">, Auditor>;
export type NameSet = Ledger.Event<"TemplateNameSet", Pick<State, "name">, Auditor>;
export type Removed = Ledger.Event<"TemplateRemoved", never, Auditor>;
export type ComponentAdded = Ledger.Event<
  "TemplateComponentAdded",
  Pick<TemplateComponent, "id" | "kind" | "layouts" | "settings">,
  Auditor
>;
export type ComponentSettingSet = Ledger.Event<
  "TemplateComponentSettingSet",
  Pick<TemplateComponent, "id"> & { setting: Partial<ComponentSettings> },
  Auditor
>;
export type ComponentLayoutSet = Ledger.Event<
  "TemplateComponentLayoutSet",
  Pick<TemplateComponent, "id"> & { desktop: Layout },
  Auditor
>;
export type ComponentRemoved = Ledger.Event<"TemplateComponentRemoved", Pick<TemplateComponent, "id">, Auditor>;

export type Event =
  | Created
  | NameSet
  | Removed
  | ComponentAdded
  | ComponentSettingSet
  | ComponentLayoutSet
  | ComponentRemoved;
