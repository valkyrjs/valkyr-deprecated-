/*
 |--------------------------------------------------------------------------------
 | Setup
 |--------------------------------------------------------------------------------
 |
 | Bootstraps application dependent steps. The steps are in strict order and
 | changing it without understanding can results in unexpected application
 | failures.
 |
 */

export async function setup(): Promise<void> {
  await loadModules();
}

/*
 |--------------------------------------------------------------------------------
 | Modules
 |--------------------------------------------------------------------------------
 */

async function loadModules(): Promise<void> {
  await Promise.all([import("./Modules/Realms")]);
}
