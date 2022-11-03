import { BrowserHistory, HashHistory, MemoryHistory } from "history";

import { Query } from "./Query";
import { Route } from "./Route";
import { ValueStore } from "./ValueStore";

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
