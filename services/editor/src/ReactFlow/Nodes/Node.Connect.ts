import { Node } from "reactflow";

import { EventBlock, ReducerBlock, ValidatorBlock } from "~Blocks/Block.Collection";
import { db } from "~Services/Database";

type Connection = {
  nodeId: string;
  handle?: string;
};

export async function setNodeConnection(source: Connection, target: Connection): Promise<void> {
  const sourceNode = await db.collection("nodes").findById(source.nodeId);
  const targetNode = await db.collection("nodes").findById(target.nodeId);

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
      return connectReducerEvent(sourceNode, targetNode);
    }
    case "state": {
      return connectStateReducer(sourceNode, targetNode);
    }
    case "validator": {
      if (target.handle === "event") {
        return connectValidatorEvent(sourceNode, targetNode);
      }
      if (target.handle === "context") {
        return connectValidatorContext(sourceNode, targetNode);
      }
      throw new Error(`No handler found for validator handle ${target.handle}`);
    }
  }
}

async function connectReducerEvent(sourceNode: Node, targetNode: Node): Promise<void> {
  console.log({ connect: "eventToReducer", sourceNode, targetNode });
  if (sourceNode.type !== "event") {
    throw new Error("Source node is not an event");
  }
  await db.collection<ReducerBlock>("blocks").updateOne(
    { id: targetNode.data.blockId },
    {
      $push: {
        events: sourceNode.data.blockId
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
    { id: sourceNode.data.blockId },
    {
      $set: {
        state: targetNode.data.blockId
      }
    }
  );
}

async function connectValidatorEvent(sourceNode: Node, targetNode: Node): Promise<void> {
  console.log({ connect: "eventToValidator", sourceNode, targetNode });
  const event = await db.collection<EventBlock>("blocks").findOne({ id: sourceNode.data.blockId });
  if (event === undefined) {
    throw new Error(`Unable to connect validator event, '${sourceNode.data.blockId}' not found`);
  }
  await db
    .collection<ValidatorBlock>("blocks")
    .updateOne({ id: targetNode.data.blockId }, { $set: { event: event.id } });
}

async function connectValidatorContext(sourceNode: Node, targetNode: Node): Promise<void> {
  console.log({ connect: "contextToValidator", sourceNode, targetNode });
  const block = await db.collection<ReducerBlock>("blocks").findOne({ id: sourceNode.data.blockId });
  if (block === undefined) {
    throw new Error(`Unable to connect validator context, '${sourceNode.data.blockId}' not found`);
  }
  await db.collection<ValidatorBlock>("blocks").updateOne(
    { id: targetNode.data.blockId },
    {
      $push: {
        context: sourceNode.data.blockId
      }
    }
  );
}
