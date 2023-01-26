import { Controller } from "@valkyr/react";
import { Node } from "reactflow";

import { db } from "~services/database";
import { format } from "~services/prettier";

import { EventData } from "../event/event.node";
import { getEventRecordCache } from "../node.utils";
import { ReducerData } from "./reducer.node";

export class ReducerNodeController extends Controller<
  {
    node: Node<ReducerData>;
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
        const nodes = await db.collection("nodes").find({ id: { $in: edges.map((edge) => edge.source) } });
        const events = nodes.filter((node) => node.type === "event");
        const state = nodes.filter((node) => node.type === "state")[0];
        this.setState(
          "model",
          format(`
            ${generateReducerEvents(events)}
            ${getEventRecordCache(events.map((node) => node.data.name))}
            ${state?.data.cache ?? "interface State {};"}
          `)
        );
      })
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

function generateReducerEvents(eventNodes: Node<EventData>[]): string {
  return eventNodes.map((node) => node.data.cache).join("\n");
}
