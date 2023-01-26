import { Controller } from "@valkyr/react";
import { Node } from "reactflow";

import { db } from "~services/database";

import { generateState, StateNodeData } from "./state.node";

export class StateNodeController extends Controller<
  {
    node: Node<StateNodeData>;
  },
  { id: string }
> {
  async onInit() {
    return {
      node: await this.query(db.collection("nodes"), { where: { id: this.props.id }, limit: 1 }, "node")
    };
  }

  setName(e: any) {
    db.collection("nodes")
      .updateOne(
        { id: this.props.id },
        {
          $set: { "data.config.name": e.target.value }
        }
      )
      .then(this.#generateMonacoModel);
  }

  addDataField() {
    db.collection("nodes").updateOne(
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
      db.collection("nodes")
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
      db.collection("nodes")
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
    const node = await db.collection("nodes").findById(this.props.id);
    if (node !== undefined) {
      db.collection("nodes").updateOne(
        { id: node.id },
        {
          $set: {
            "data.monaco.model": generateState(node.data.config.data)
          }
        }
      );
    }
  };
}
