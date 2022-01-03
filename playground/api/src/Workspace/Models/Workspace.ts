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
 | Types
 |--------------------------------------------------------------------------------
 */

class Invite extends Document {
  @Prop()
  id!: string;

  @Prop()
  email!: string;
}

class Member extends Document {
  @Prop()
  id!: string;

  @Prop()
  accountId!: string;

  @Prop()
  name?: string;
}

/*
 |--------------------------------------------------------------------------------
 | Model
 |--------------------------------------------------------------------------------
 */

@Schema()
export class Workspace {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ type: Invite })
  invites?: Invite[];

  @Prop({ type: Member })
  members?: Member[];
}

/*
 |--------------------------------------------------------------------------------
 | Schema
 |--------------------------------------------------------------------------------
 */

export const WorkspaceSchema = SchemaFactory.createForClass(Workspace);
