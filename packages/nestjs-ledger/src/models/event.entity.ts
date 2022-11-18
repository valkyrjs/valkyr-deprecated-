import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { EventRecord } from "@valkyr/ledger";
import { Document } from "mongoose";

/*
 |--------------------------------------------------------------------------------
 | Document
 |--------------------------------------------------------------------------------
 */

export type EventDocument = Document & EventRecord;

/*
 |--------------------------------------------------------------------------------
 | Model
 |--------------------------------------------------------------------------------
 */

@Schema({ toJSON: { transform } })
export class EventEntity implements EventRecord {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true, index: true })
  stream!: string;

  @Prop({ required: true, index: true })
  type!: string;

  @Prop({ type: {}, required: true })
  data!: any;

  @Prop({ type: {}, required: true })
  meta!: any;

  @Prop({ required: true, index: true })
  created!: string;

  @Prop({ required: true, index: true })
  recorded!: string;
}

function transform(_: any, obj: any) {
  delete obj._id;
  delete obj.__v;
  return obj;
}

/*
 |--------------------------------------------------------------------------------
 | Schema
 |--------------------------------------------------------------------------------
 */

export const EventSchema = SchemaFactory.createForClass(EventEntity);
