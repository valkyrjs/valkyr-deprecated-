import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

/*
 |--------------------------------------------------------------------------------
 | Document
 |--------------------------------------------------------------------------------
 */

export type EventDocument = Event & Document;

/*
 |--------------------------------------------------------------------------------
 | Model
 |--------------------------------------------------------------------------------
 */

@Schema()
export class Event {
  /**
   * A unique event identifier correlating its identity in the **event store**
   * _(database)_.
   */
  @Prop({ required: true, unique: true })
  id!: string;

  /**
   * Identifier representing the stream in which many individual events/transactions
   * belongs to and is used to generate a specific aggregate state representation of
   * that particular identity.
   */
  @Prop({ required: true, index: true })
  streamId!: string;

  /**
   * Event identifier describing the intent of the event in a past tense format.
   */
  @Prop({ required: true, index: true })
  type!: string;

  /**
   * Stores the recorded partial piece of data that makes up a larger aggregate
   * state.
   */
  @Prop({ type: {}, required: true })
  data!: any;

  /**
   * Stores additional meta data about the event that is not directly related
   * to the aggregate state.
   */
  @Prop({ type: {}, required: true })
  meta!: any;

  /**
   * An immutable logical hybrid clock timestamp representing the wall time when
   * the event was created.
   *
   * This value is used to identify the date of its creation as well as a sorting
   * key when performing reduction logic to generate aggregate state for the stream
   * in which the event belongs.
   */
  @Prop({ required: true, index: true })
  created!: string;

  /**
   * A mutable logical hybrid clock timestamps representing the wall time when the
   * event was recorded to the local **event ledger** _(database)_ as opposed to
   * when the event was actually created.
   *
   * This value is used when performing event synchronization between two different
   * event ledgers.
   */
  @Prop({ required: true, index: true })
  recorded!: string;
}

/*
 |--------------------------------------------------------------------------------
 | Schema
 |--------------------------------------------------------------------------------
 */

export const EventSchema = SchemaFactory.createForClass(Event);
