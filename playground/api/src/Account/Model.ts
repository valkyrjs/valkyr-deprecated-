import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

/*
 |--------------------------------------------------------------------------------
 | Document
 |--------------------------------------------------------------------------------
 */

export type AccountDocument = Account & Document;

/*
 |--------------------------------------------------------------------------------
 | Model
 |--------------------------------------------------------------------------------
 */

class Name extends Document {
  @Prop()
  family?: string;

  @Prop()
  given?: string;
}

@Schema()
export class Account {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true })
  status!: string;

  @Prop({ type: Name })
  name?: Name;

  @Prop()
  alias?: string;

  @Prop({ required: true })
  email!: string;

  @Prop()
  token?: string;
}

/*
 |--------------------------------------------------------------------------------
 | Schema
 |--------------------------------------------------------------------------------
 */

export const AccountSchema = SchemaFactory.createForClass(Account);
