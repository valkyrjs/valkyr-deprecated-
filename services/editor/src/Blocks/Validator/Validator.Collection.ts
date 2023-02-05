import { ModelManager } from "~Blocks/Model.Manager";
import { db } from "~Services/Database";
import { format } from "~Services/Prettier";

import { BlockContext, EventBlock, ValidatorBlock } from "../Block.Collection";

const defaultValue = format(`
  api.validator.on("Event", async (event, context) => {
    // Enter your validation code here ...
  });
`);

/*
 |--------------------------------------------------------------------------------
 | Helpers
 |--------------------------------------------------------------------------------
 */

export async function createValidatorBlock({
  value = defaultValue,
  context = []
}: Partial<ValidatorBlock> = {}): Promise<string> {
  const result = await db
    .collection<ValidatorBlock>("blocks")
    .insertOne({ type: "validator", name: crypto.randomUUID(), value, context });
  if (result.acknowledged === false) {
    throw new Error("Failed to create validator block");
  }
  return result.insertedId;
}

/*
 |--------------------------------------------------------------------------------
 | Monaco
 |--------------------------------------------------------------------------------
 */

const models = new ModelManager();

db.collection<ValidatorBlock>("blocks").subscribe({ type: "validator" }, {}, (validators) => {
  models.flush();
  for (const validator of validators) {
    registerValidatorContextInterface(validator);
  }
});

async function registerValidatorContextInterface(validator: ValidatorBlock): Promise<void> {
  const event = await db.collection<EventBlock>("blocks").findOne({ id: validator.event });
  if (event === undefined) {
    return;
  }
  models.add(`
    interface Contexts {
      ${event.name}: {${await getValidatorContext(validator.context)}}
    }
  `);
}

async function getValidatorContext(contexts: BlockContext[]): Promise<string> {
  const output: string[] = [];
  for (const { key, value } of contexts) {
    output.push(`${key}: ${value};`);
  }
  return output.join("\n");
}
