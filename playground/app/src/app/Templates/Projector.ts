import { EventProjector, On, Projector } from "@valkyr/angular";
import { LedgerEventRecord } from "@valkyr/ledger";
import { TemplateStore } from "stores";

import { Template } from "./Models/Template";

@Projector()
export class TemplateProjector extends EventProjector {
  @On("TemplateCreated")
  public async onTemplateCreated({
    streamId,
    data: { workspaceId, name, color }
  }: LedgerEventRecord<TemplateStore.Created>) {
    await Template.insertOne({
      id: streamId,
      workspaceId,
      name,
      color
    });
  }
}

// import { ledger } from "@valkyr/client";
// import { Template as Store } from "stores";

// import { Item } from "../Models/Item";
// import { Template } from "../Models/Template";

// ledger.projection.on<Store.Created>(
//   "TemplateCreated",
//   async ({ streamId, data: { workspaceId, name, color, components } }) => {
//     await Template.insert({
//       id: streamId,
//       workspaceId,
//       name,
//       color,
//       components
//     });
//   }
// );

// ledger.projection.on<Store.Removed>("TemplateRemoved", async ({ streamId }) => {
//   const items = await Item.find({ templateId: streamId });
//   for (const item of items) {
//     await Item.delete(item.id);
//   }
//   await Template.delete(streamId);
// });

// ledger.projection.on<Store.NameSet>("TemplateNameSet", async ({ streamId, data: { name } }) => {
//   await Template.update({
//     id: streamId,
//     name
//   });
// });

// ledger.projection.on<Store.ComponentAdded>("TemplateComponentAdded", async ({ streamId, data: component }) => {
//   const template = await Template.findById(streamId);
//   const components = [...template.components, component];
//   await Template.update({
//     id: streamId,
//     components
//   });
// });

// ledger.projection.on<Store.ComponentRemoved>("TemplateComponentRemoved", async ({ streamId, data: { id } }) => {
//   const template = await Template.findById(streamId);
//   const components = [...template.components.filter((c) => c.id !== id)];
//   await Template.update({
//     id: streamId,
//     components
//   });
// });

// ledger.projection.on<Store.ComponentLayoutSet>(
//   "TemplateComponentLayoutSet",
//   async ({ streamId, data: { id, desktop } }) => {
//     const template = await Template.findById(streamId);
//     const component = template.components.find((c) => c.id === id);
//     component.layouts.desktop = desktop;
//     const components = [...template.components.filter((c) => c.id !== id), component];
//     await Template.update({
//       id: streamId,
//       components
//     });
//   }
// );

// ledger.projection.on<Store.ComponentSettingSet>(
//   "TemplateComponentSettingSet",
//   async ({ streamId, data: { id, setting } }) => {
//     const template = await Template.findById(streamId);
//     const component = template.components.find((c) => c.id === id);
//     component.settings = { ...component.settings, ...setting };
//     await Template.update({
//       id: streamId,
//       components: template.components
//     });
//   }
// );
