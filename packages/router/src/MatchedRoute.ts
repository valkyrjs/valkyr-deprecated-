import { BrowserHistory, HashHistory, MemoryHistory } from "history";

import { Query } from "./Query";
import { Resolved, Route } from "./Route";
import { State } from "./State";
import { ValueStore } from "./ValueStore";

export class MatchedRoute {
  readonly route: Route;
  readonly params: ValueStore;
  readonly query: Query;
  readonly state: State;

  constructor({ route, params }: Resolved, history: BrowserHistory | HashHistory | MemoryHistory) {
    this.route = route;
    this.params = new ValueStore(params);
    this.query = new Query(history, history.location.search);
    this.state = new State(history.location.state);
  }
}
