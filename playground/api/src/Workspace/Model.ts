import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

/*
 |--------------------------------------------------------------------------------
 | Document
 |--------------------------------------------------------------------------------
 */

export type WorkspaceDocument = Workspace & Document;

/*
 |--------------------------------------------------------------------------------
 | Model
 |--------------------------------------------------------------------------------
 */

@Schema()
export class Workspace {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({
    type: {
      id: String,
      email: String
    }
  })
  invites?: {
    id: string;
    email: string;
  }[];

  @Prop({
    type: {
      id: String,
      accountId: String,
      name: String
    }
  })
  members?: {
    id: string;
    accountId: string;
    name: string;
  }[];
}

/*
 |--------------------------------------------------------------------------------
 | Schema
 |--------------------------------------------------------------------------------
 */

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
