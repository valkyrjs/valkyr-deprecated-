export class EntityNotFoundError extends Error {
  public readonly type = "EntityNotFoundError";

  constructor(entityId: string) {
    super(`Entity Violation: Cannot append incoming descriptor, entity ${entityId} does not exist`);
  }
}
