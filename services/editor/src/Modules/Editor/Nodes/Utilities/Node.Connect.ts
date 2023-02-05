import { Node } from "reactflow";

import { ReducerBlock } from "~Blocks/Block.Collection";
import { db } from "~Services/Database";

export async function setNodeConnection(source: string, target: string): Promise<void> {
  const sourceNode = await db.collection("nodes").findById(source);
  const targetNode = await db.collection("nodes").findById(target);

  if (
    sourceNode === undefined ||
    targetNode === undefined ||
    sourceNode.type === undefined ||
    targetNode.type === undefined
  ) {
    return;
  }

  switch (targetNode.type) {
    case "reducer": {
      await connectReducerEvent(sourceNode, targetNode);
      break;
    }
    case "state": {
      await connectStateReducer(sourceNode, targetNode);
      break;
    }
  }
}

async function connectReducerEvent(sourceNode: Node, targetNode: Node): Promise<void> {
  console.log({ connect: "eventToReducer", sourceNode, targetNode });
  if (sourceNode.type !== "event") {
    throw new Error("Source node is not an event");
  }
  await db.collection<ReducerBlock>("blocks").updateOne(
    { id: targetNode.data.id },
    {
      $push: {
        events: sourceNode.data.id
      }
    }
  );
}

async function connectStateReducer(sourceNode: Node, targetNode: Node): Promise<void> {
  console.log({ connect: "reducerToState", sourceNode, targetNode });
  if (sourceNode.type !== "reducer") {
    throw new Error("Source node is not a reducer");
  }
  await db.collection<ReducerBlock>("blocks").updateOne(
    { id: sourceNode.data.id },
    {
      $set: {
        state: targetNode.data.id
      }
    }
  );
}
