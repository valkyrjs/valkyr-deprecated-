import { Controller } from "@valkyr/solid";

import { router } from "~Services/Router";

import { db, Todo } from "../Database";
import { TodoListForm } from "./TodoList.Form";

export class TodoController extends Controller<{
  todos: Todo[];
  form: TodoListForm;
}> {
  async onInit() {
    this.setState({
      todos: await db.collection("todos").find({ workspaceId: router.params.get("workspaceId") }),
      form: new TodoListForm({
        description: ""
      }).onError(console.log)
    });
    this.#subscribeToTodos();
  }

  #subscribeToTodos() {
    db.collection("todos").subscribe({ workspaceId: router.params.get("workspaceId") }, {}, (todos) => {
      this.state.todos = todos;
    });
  }
}
