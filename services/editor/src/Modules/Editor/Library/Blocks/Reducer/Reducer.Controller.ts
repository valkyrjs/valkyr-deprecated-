import { Controller } from "@valkyr/react";

import { db } from "~Services/Database";
import { format } from "~Services/Prettier";

import { getFieldsType } from "../../Utilities/BlockFields";
import { EventBlock, getEventDataTypes, getEventNamesRecord } from "../Event/Event.Collection";
import { StateBlock } from "../State/State.Collection";
import { ReducerBlock } from "./Reducer.Collection";

export class ReducerNodeController extends Controller<
  {
    block?: ReducerBlock;
    state?: StateBlock;
    events: EventBlock[];
    model: string;
  },
  {
    id: string;
  }
> {
  async onInit() {
    const block = await this.query(
      db.collection("reducers"),
      { where: { id: this.props.id }, limit: 1 },
      async (block) => {
        if (block === undefined) {
          return { events: [], model: "" };
        }

        const state = await this.#queryState(block.state);
        const events = await this.#queryEvents(block.events);

        return {
          block,
          state,
          events,
          model: this.#getModel(state, events)
        };
      }
    );
    return { block };
  }

  async #queryState(id?: string) {
    if (id === undefined) {
      return undefined;
    }
    return this.query(db.collection("states"), { where: { id }, limit: 1 }, async (state) => ({
      state,
      model: this.#getModel(state, this.state.events)
    }));
  }

  async #queryEvents(ids: string[]) {
    return this.query(db.collection("events"), { where: { id: { $in: ids } } }, async (events) => ({
      events,
      model: this.#getModel(this.state.state, events)
    }));
  }

  onChange(code: string) {
    db.collection("reducers").updateOne({ id: this.props.id }, { $set: { code } });
  }

  async onRemove() {
    await db.collection("edges").remove({ source: this.props.id });
    await db.collection("nodes").remove({ id: this.props.id });
  }

  #getModel(state?: StateBlock, events: EventBlock[] = []) {
    return format(`
      ${events.map((event) => getEventDataTypes(event)).join("\n")}
      ${getEventNamesRecord(events.map((event) => event.name))}
      ${state ? getFieldsType(state.name, state.data) : "type State {};"}
    `);
  }
}
