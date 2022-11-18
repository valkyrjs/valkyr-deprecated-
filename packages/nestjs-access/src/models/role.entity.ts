import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

/*
 |--------------------------------------------------------------------------------
 | Document
 |--------------------------------------------------------------------------------
 */

export type RoleDocument = RoleEntity & Document;

/*
 |--------------------------------------------------------------------------------
 | Model
 |--------------------------------------------------------------------------------
 */

@Schema()
export class RoleEntity<Permissions extends Record<string, unknown> = any> {
  @Prop({ required: true, index: true })
  id!: string;

  @Prop({ required: true, index: true })
  container!: string;

  @Prop({ required: true })
  name!: string;

  @Prop({ type: Object, default: {} })
  settings!: Record<string, unknown>;

  @Prop({ type: Object, default: {} })
  permissions!: Permissions;

  @Prop({ type: Array, default: [] })
  members!: string[];
}

/*
 |--------------------------------------------------------------------------------
 | Schema
 |--------------------------------------------------------------------------------
 */

export const RoleSchema = SchemaFactory.createForClass(RoleEntity);
