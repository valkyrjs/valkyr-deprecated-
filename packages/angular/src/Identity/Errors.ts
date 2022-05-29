export class SelectedUserNotFoundError extends Error {
  readonly type = "SelectedUserNotFoundError";

  constructor() {
    super("Identity Violation: No active user has been set for this session");
  }
}

export class UserIdentityNotFoundError extends Error {
  readonly type = "UserIdentityNotFoundError";

  constructor(cid: string) {
    super(`Identity Violation: User ${cid} not found on the authenticated identity`);
  }
}
