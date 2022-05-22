import { LedgerEvent, LedgerEventToLedgerRecord, makeEventFactory } from "@valkyr/ledger";

import { ComponentSettings, Layout } from "../Types";
import type { Auditor } from "../Workspace";
import type { State, TemplateComponent } from "./Aggregate";

export const events = {
  created: makeEventFactory<Created>("TemplateCreated"),
  nameSet: makeEventFactory<NameSet>("TemplateNameSet"),
  removed: makeEventFactory<Removed>("TemplateRemoved"),
  components: {
    added: makeEventFactory<ComponentAdded>("TemplateComponentAdded"),
    settingSet: makeEventFactory<ComponentSettingSet>("TemplateComponentSettingSet"),
    layoutSet: makeEventFactory<ComponentLayoutSet>("TemplateComponentLayoutSet"),
    removed: makeEventFactory<ComponentRemoved>("TemplateComponentRemoved")
  }
};

export type Created = LedgerEvent<"TemplateCreated", Pick<State, "workspaceId" | "name" | "color">, Auditor>;
export type NameSet = LedgerEvent<"TemplateNameSet", Pick<State, "name">, Auditor>;
export type Removed = LedgerEvent<"TemplateRemoved", never, Auditor>;
export type ComponentAdded = LedgerEvent<
  "TemplateComponentAdded",
  Pick<TemplateComponent, "id" | "kind" | "layouts" | "settings">,
  Auditor
>;
export type ComponentSettingSet = LedgerEvent<
  "TemplateComponentSettingSet",
  Pick<TemplateComponent, "id"> & { setting: Partial<ComponentSettings> },
  Auditor
>;
export type ComponentLayoutSet = LedgerEvent<
  "TemplateComponentLayoutSet",
  Pick<TemplateComponent, "id"> & { desktop: Layout },
  Auditor
>;
export type ComponentRemoved = LedgerEvent<"TemplateComponentRemoved", Pick<TemplateComponent, "id">, Auditor>;

export type Event =
  | Created
  | NameSet
  | Removed
  | ComponentAdded
  | ComponentSettingSet
  | ComponentLayoutSet
  | ComponentRemoved;

export type EventRecord = LedgerEventToLedgerRecord<Event>;
