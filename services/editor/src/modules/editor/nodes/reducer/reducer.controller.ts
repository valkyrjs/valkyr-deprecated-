import { Controller } from "@valkyr/react";
import { Node } from "reactflow";

import { db } from "~services/database";
import { format } from "~services/prettier";

import { EventNodeData } from "../event/event.node";
import { generateEventRecord, generateLedger } from "../event/generators/ledger";
import { ReducerNodeData } from "./reducer.node";

export class ReducerNodeController extends Controller<
  {
    node: Node<ReducerNodeData>;
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
        const events = nodes.filter((node) => node.data.type === "event");
        const state = nodes.filter((node) => node.data.type === "state")[0];
        this.setState(
          "model",
          format(`
            ${generateLedger()}
            ${generateReducerEvents(events)}
            ${generateEventRecord(events.map((node) => node.data.config.name))}
            ${state.data.monaco.model ?? "interface State = {};"}
          `)
        );
      })
    );
  }

  async onChange(value: string) {
    db.collection("nodes").updateOne(
      { id: this.props.id },
      {
        $set: {
          "data.config.code": value
        }
      }
    );
  }
}

function generateReducerEvents(eventNodes: Node<EventNodeData>[]): string {
  return eventNodes.map((node) => node.data.monaco.model).join("\n");
}
