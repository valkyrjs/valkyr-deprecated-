import { Document, Model } from "@valkyr/db";

export type TemplateDocument = Document & {
  workspaceId: string;
  name: string;
  color: string;
};

export class Template extends Model<TemplateDocument> {
  readonly workspaceId!: TemplateDocument["workspaceId"];
  readonly name!: TemplateDocument["name"];
  readonly color!: TemplateDocument["color"];
}

export type TemplateModel = typeof Template;
