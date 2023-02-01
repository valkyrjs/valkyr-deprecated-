import { Controller } from "@valkyr/react";
import { EdgeProps } from "reactflow";

import { db } from "~Services/Database";

import { addEdge, removeEdge } from "../../Edges/Edge.Utilities";

export class ReducerNodeController extends Controller<{}, EdgeProps> {
  #state?: string;
  #events: string[] = [];

  async onInit() {
    this.subscriptions.set(
      "reducers",
      db.collection("reducers").subscribe({ id: this.props.data.id }, { limit: 1 }, (reducer) => {
        this.#handleState(reducer?.state);
        this.#handleEvents(reducer?.events ?? []);
      })
    );
  }

  #handleState(state?: string) {
    if (state !== undefined && this.#state === undefined) {
      addEdge(state, this.props.id, {
        sourceType: "state",
        onRemove: this.#removeState
      });
      this.#state = state;
    }
    if (state === undefined && this.#state !== undefined) {
      removeEdge(this.#state, this.props.id);
      this.#state = undefined;
    }
    if (state !== undefined && this.#state !== undefined && state !== this.#state) {
      addEdge(state, this.props.id, {
        sourceType: "state",
        onRemove: this.#removeState
      });
      removeEdge(this.#state, this.props.id);
      this.#state = state;
    }
  }

  #handleEvents(events: string[]) {
    const add = events.filter((event) => !this.#events.includes(event));
    const remove = this.#events.filter((event) => !events.includes(event));
    for (const event of add) {
      addEdge(event, this.props.id, {
        sourceType: "event",
        onRemove: () => {
          db.collection("reducers").updateOne({ id: this.props.data.id }, { $pull: { events: event } });
        }
      });
      this.#events.push(event);
    }
    for (const event of remove) {
      removeEdge(event, this.props.id);
      this.#events = this.#events.filter((id) => id !== event);
    }
  }

  #removeState = () => {
    db.collection("reducers").updateOne({ id: this.props.data.id }, { $set: { state: undefined } });
  };
}
