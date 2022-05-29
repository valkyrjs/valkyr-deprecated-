import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

/*
 |--------------------------------------------------------------------------------
 | Document
 |--------------------------------------------------------------------------------
 */

export type IdentityDocument = Document & {
  id: string;
  alias: string;
  data: string;
  signature: string;
  vault: string;
};

/*
 |--------------------------------------------------------------------------------
 | Model
 |--------------------------------------------------------------------------------
 */

@Schema()
export class Identity {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true, unique: true })
  alias!: string;

  @Prop({ required: true })
  data!: string;

  @Prop({ required: true })
  signature!: string;

  @Prop({ required: true })
  vault!: string;
}

/*
 |--------------------------------------------------------------------------------
 | Schema
 |--------------------------------------------------------------------------------
 */

export const IdentitySchema = SchemaFactory.createForClass(Identity);
