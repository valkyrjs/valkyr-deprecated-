import { ModelManager } from "~Blocks/Model.Manager";
import { toCamelCase } from "~Services/Casing";
import { db } from "~Services/Database";
import { format } from "~Services/Prettier";

import { EventBlock, ValidatorBlock } from "../Block.Collection";

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

async function getValidatorContext(contexts: string[]): Promise<string> {
  const blocks = await db.collection("blocks").find({ id: { $in: contexts } });
  const output: string[] = [];
  for (const { name } of blocks) {
    output.push(`${toCamelCase(name)}: ${name};`);
  }
  return output.join("\n");
}
