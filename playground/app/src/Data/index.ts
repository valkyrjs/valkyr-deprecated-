export * from "./Adapter";
export * from "./Models/Account";
export * from "./Models/Workspace";
export * from "./Remote";
export * from "./Socket";

/*
 |--------------------------------------------------------------------------------
 | Setup
 |--------------------------------------------------------------------------------
 */

async function setup() {
  await projections();
}

/*
 |--------------------------------------------------------------------------------
 | Events
 |--------------------------------------------------------------------------------
 */

async function projections() {
  await Promise.all([import("./Projections/Account"), import("./Projections/Workspace")]);
}

/*
 |--------------------------------------------------------------------------------
 | Exports
 |--------------------------------------------------------------------------------
 */

export const data = {
  setup
};
