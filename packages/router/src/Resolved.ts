import { BrowserHistory, HashHistory, MemoryHistory } from "history";

import { Query } from "./Query.js";
import { Route } from "./Route.js";
import { ValueStore } from "./ValueStore.js";

export class Resolved {
  readonly params: ValueStore;
  readonly query: Query;

  constructor(
    readonly route: Route,
    params: Object,
    search: string | undefined,
    history: BrowserHistory | HashHistory | MemoryHistory
  ) {
    this.params = new ValueStore(params);
    this.query = new Query(history, search);
  }
}
