import { BrowserHistory, HashHistory, MemoryHistory } from "history";

import { Query } from "./Query";
import { Resolved, Route } from "./Route";
import { State } from "./State";
import { ValueStore } from "./ValueStore";

export class MatchedRoute {
  readonly params: ValueStore;
  readonly query: Query;
  readonly state: State;
  readonly route: Route;

  constructor(history: BrowserHistory | HashHistory | MemoryHistory, { route, params }: Resolved) {
    this.params = new ValueStore(params);
    this.query = new Query(history, history.location.search);
    this.state = new State(history.location.state);
    this.route = route;
  }
}
