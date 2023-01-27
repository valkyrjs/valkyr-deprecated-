import { db } from "~services/database";
import { format } from "~services/prettier";

import { getPosition } from "../node.utils";

const type = "validator";

export async function addValidatorNode(): Promise<void> {
  db.collection("nodes").insertOne({
    type,
    position: await getPosition(type),
    dragHandle: ".node-drag-handle",
    data: getValidatorData()
  });
}

export function getValidatorData(): ValidatorData {
  return {
    name: type,
    value: format(`
      async function validate(state: State, event: EventRecord): Promise<void> {
        // write your validation logic here ...
      };
    `)
  };
}

export type ValidatorData = {
  name: string;
  value: string;
};
