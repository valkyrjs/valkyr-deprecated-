import { Pipe } from "@angular/core";

import { Todo } from "../Models/Todo";

@Pipe({ name: "sorttodos" })
export class SortTodosPipe {
  transform(value: Todo[]) {
    console.log("sorttodos", value);
    return value.sort((a: Todo, b: Todo) => {
      if (a.sort == b.sort) return 0;
      else if (!a.sort) return -1;
      else if (!a.sort || (b.sort && a.sort < b.sort)) return -1;

      return 1;
    });
  }
}
