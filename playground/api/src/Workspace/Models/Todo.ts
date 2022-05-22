import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document } from "mongoose";

/*
 |--------------------------------------------------------------------------------
 | Document
 |--------------------------------------------------------------------------------
 */

export type TodoDocument = Todo & Document;

/*
 |--------------------------------------------------------------------------------
 | Model
 |--------------------------------------------------------------------------------
 */

@Schema()
export class Todo {
  @Prop({ required: true, unique: true })
  id!: string;

  @Prop({ required: true })
  workspaceId!: string;

  @Prop({ required: false })
  sort?: number;
}

/*
 |--------------------------------------------------------------------------------
 | Schema
 |--------------------------------------------------------------------------------
 */

export const TodoSchema = SchemaFactory.createForClass(Todo);
