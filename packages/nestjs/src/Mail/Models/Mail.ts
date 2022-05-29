import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

/*
 |--------------------------------------------------------------------------------
 | Document
 |--------------------------------------------------------------------------------
 */

export type MailDocument = Document & {
  sender: string;
  receiver: string;
  subject: string;
  data: string;
  signature: string;
};

/*
 |--------------------------------------------------------------------------------
 | Model
 |--------------------------------------------------------------------------------
 */

@Schema()
export class Mail {
  @Prop({ required: true })
  sender!: string;

  @Prop({ required: true })
  receiver!: string;

  @Prop({ required: true })
  subject!: string;

  @Prop({ required: true })
  data!: string;

  @Prop({ required: true })
  signature!: string;
}

/*
 |--------------------------------------------------------------------------------
 | Schema
 |--------------------------------------------------------------------------------
 */

export const MailSchema = SchemaFactory.createForClass(Mail);
