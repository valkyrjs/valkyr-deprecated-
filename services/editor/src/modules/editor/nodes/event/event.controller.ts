import { Controller } from "@valkyr/react";
import { Node } from "reactflow";

import { nodes } from "~services/database";

import { EventNodeData } from "./event.node";
import { generateEvent } from "./generators/ledger";

export class EventNodeController extends Controller<{}, Node<EventNodeData>> {
  setType(e: any) {
    nodes
      .updateOne(
        { id: this.props.id },
        {
          $set: { "data.config.name": e.target.value }
        }
      )
      .then(this.#generateMonacoModel);
  }

  addDataField() {
    nodes.updateOne(
      {
        id: this.props.id
      },
      {
        $push: {
          "data.config.data": ["", "p:string"]
        }
      }
    );
  }

  setDataField(index: number) {
    return (e: any) => {
      nodes
        .updateOne(
          { id: this.props.id },
          {
            $set: { [`data.config.data[${index}]`]: [e.target.value, "p:string"] }
          }
        )
        .then(this.#generateMonacoModel);
    };
  }

  removeDataField(index: number) {
    return () => {
      nodes
        .updateOne(
          {
            id: this.props.id
          },
          {
            $set: {
              "data.config.data": (data: any[]) =>
                data.reduce((list, _, i) => {
                  if (i !== index) {
                    list.push(data[i]);
                  }
                  return list;
                }, [])
            }
          }
        )
        .then(this.#generateMonacoModel);
    };
  }

  #generateMonacoModel = async (): Promise<void> => {
    const node = await nodes.findById(this.props.id);
    if (node !== undefined) {
      nodes.updateOne(
        { id: node.id },
        {
          $set: {
            "data.monaco.model": generateEvent(node.data.config)
          }
        }
      );
    }
  };
}
