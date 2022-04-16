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

@Schema()
export class Account {
  @Prop({ required: true })
  id!: string;

  @Prop({ required: true })
  status!: string;

  @Prop({
    type: {
      family: String,
      given: String
    }
  })
  name?: {
    family?: string;
    given?: string;
  };

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
