import { Icon } from "solid-heroicons";
import { archiveBox } from "solid-heroicons/solid-mini";

import { Checkbox } from "~Components/Form/Checkbox.Component";
import { Separator } from "~Components/Separator.Component";

import { TodoController } from "./Todo.Controller";

export const TodoView = TodoController.view(({ state }) => {
  return (
    <div class="flex h-screen w-screen justify-center py-10">
      <div class="min-w-[320px]">
        <form onSubmit={state.form.submit}>
          <input
            type="text"
            placeholder="Enter todo description"
            class="mt-2 w-full rounded-lg border border-gray-500 bg-gray-700 px-4 py-3 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
            {...state.form.register("description")}
          />
          <button
            type="submit"
            class="mt-6 block w-full rounded-lg bg-indigo-500 px-4 py-3 font-semibold
              text-white hover:bg-indigo-400 focus:bg-indigo-400"
          >
            Add Todo
          </button>
        </form>
        <Separator text="TODOS" />
        <ul>
          {state.todos.length === 0 ? (
            <li class="text-center">No todos added, why not create a new one?</li>
          ) : (
            state.todos.map((todo) => (
              <li class="mb-3">
                <div class="flex items-center">
                  <Checkbox checked={todo.completed} />
                  <input
                    type="text"
                    value={todo.description}
                    class="ml-1 w-full rounded-lg border border-gray-500 bg-gray-700 px-2 py-1 focus:border-blue-500 focus:bg-gray-800 focus:outline-none"
                  />
                  <button class="ml-2 flex h-8 w-8 items-center justify-center rounded-lg border border-red-700 px-1 hover:border-red-500 hover:bg-red-700">
                    <Icon path={archiveBox} class="h-4 text-red-600 hover:text-white" />
                  </button>
                </div>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
});
