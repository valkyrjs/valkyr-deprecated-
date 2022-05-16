import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { AnyKeys, Model } from "mongoose";

import { Todo, TodoDocument } from "../Models/Todo";

@Injectable()
export class TodoService {
  constructor(@InjectModel(Todo.name) private readonly model: Model<TodoDocument>) {}

  public async set(doc: AnyKeys<TodoDocument>) {
    return this.model.create(doc);
  }

  public async get(workspaceId: string) {
    const todos = await this.model.find({ workspaceId });
    return todos.map((todo) => todo.id);
  }

  public async update(id: string, data: AnyKeys<TodoDocument>) {
    return this.model.updateOne({ id }, data);
  }
}
