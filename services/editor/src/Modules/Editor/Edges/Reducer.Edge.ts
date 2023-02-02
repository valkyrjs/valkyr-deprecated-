import { ReducerBlock } from "~Blocks/Block.Collection";
import { db } from "~Services/Database";

import { ConnectionParams } from "../Nodes/Node.Types";

export async function addReducerEdge(from: ConnectionParams, id: string): Promise<boolean> {
  switch (from.type) {
    case "event": {
      const result = await db.collection<ReducerBlock>("blocks").updateOne(
        { id },
        {
          $push: {
            events: from.id
          }
        }
      );
      if (result.modified < 1) {
        return false;
      }
      return true;
    }
    case "state": {
      const result = await db.collection<ReducerBlock>("blocks").updateOne(
        { id },
        {
          $set: {
            state: from.id
          }
        }
      );
      if (result.modified < 1) {
        return false;
      }
      return true;
    }
    default: {
      return false;
    }
  }
}
