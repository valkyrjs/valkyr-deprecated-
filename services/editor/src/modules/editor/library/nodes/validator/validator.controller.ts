import { Controller } from "@valkyr/react";
import { Node } from "reactflow";

import { db } from "~services/database";
import { format } from "~services/prettier";

import { EventData } from "../event/event.node";
import { getEventDataTypes, getEventNamesRecord, getFieldsType } from "../node.utils";
import { StateData } from "../state/state.node";
import { ValidatorData } from "./validator.node";

export class ValidatorNodeController extends Controller<
  {
    node: Node<ValidatorData>;
    state?: Node<StateData>;
    event?: Node<EventData>;
    model: string;
  },
  {
    id: string;
  }
> {
  async onInit() {
    this.#subscribeToModel();
    return {
      node: await this.query(db.collection("nodes"), { where: { id: this.props.id }, limit: 1 }, "node"),
      model: ""
    };
  }

  async #subscribeToModel() {
    this.subscriptions.set(
      "edges",
      db.collection("edges").subscribe({ target: this.props.id }, {}, async (edges) => {
        await this.#subscribeToSources(edges.map((edge) => edge.source));
        this.#setModelState();
      })
    );
  }

  async #subscribeToSources(ids: string[]) {
    const nodes = await db.collection("nodes").find({ id: { $in: ids } });

    const events = nodes.filter((node) => node.type === "event");
    await this.#subscribeToEvent(events.shift());
    this.#removeInvalidNodes(events);

    const states = nodes.filter((node) => node.type === "state");
    await this.#subscribeToState(states.shift());
    this.#removeInvalidNodes(states);
  }

  async #subscribeToEvent(event: Node<EventData> | undefined) {
    this.subscriptions.get("event")?.unsubscribe();
    if (event !== undefined) {
      await new Promise<void>((resolve) => {
        this.subscriptions.set(
          "event",
          db.collection("nodes").subscribe({ id: event.id }, { limit: 1 }, (event) => {
            this.setState("event", event);
            this.#setModelState();
            resolve();
          })
        );
      });
    }
  }

  async #subscribeToState(state: Node<StateData> | undefined) {
    this.subscriptions.get("state")?.unsubscribe();
    if (state !== undefined) {
      await new Promise<void>((resolve) => {
        this.subscriptions.set(
          "state",
          db.collection("nodes").subscribe({ id: state.id }, { limit: 1 }, (state) => {
            this.setState("state", state);
            this.#setModelState();
            resolve();
          })
        );
      });
    }
  }

  #removeInvalidNodes(nodes: Node[]) {
    for (const node of nodes) {
      db.collection("edges").remove({ source: node.id, target: this.props.id });
    }
  }

  #setModelState() {
    const { state, event } = this.state;
    this.setState(
      "model",
      format(`
        ${event ? getEventDataTypes(event.data) : ""}
        ${event ? getEventNamesRecord([event.data.name]) : ""}
        ${state ? getFieldsType("State", state.data.data) : "type State = {};"}
      `)
    );
  }

  onChange(value: string) {
    db.collection("nodes").updateOne(
      { id: this.props.id },
      {
        $set: {
          "data.value": value
        }
      }
    );
  }

  async onRemove() {
    await db.collection("edges").remove({ source: this.props.id });
    await db.collection("nodes").remove({ id: this.props.id });
  }
}
