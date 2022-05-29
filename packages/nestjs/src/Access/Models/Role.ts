import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

/*
 |--------------------------------------------------------------------------------
 | Document
 |--------------------------------------------------------------------------------
 */

export type RoleDocument = Role & Document;

/*
 |--------------------------------------------------------------------------------
 | Model
 |--------------------------------------------------------------------------------
 */

@Schema()
export class Role {
  @Prop({ required: true, index: true })
  id!: string;

  @Prop({ required: true, index: true })
  tenantId!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ type: Object, default: {} })
  settings!: Record<string, unknown>;

  @Prop({ type: Object, default: {} })
  permissions!: Record<string, unknown>;

  @Prop({ type: Array, default: [] })
  members!: string[];
}

/*
 |--------------------------------------------------------------------------------
 | Schema
 |--------------------------------------------------------------------------------
 */

export const RoleSchema = SchemaFactory.createForClass(Role);
