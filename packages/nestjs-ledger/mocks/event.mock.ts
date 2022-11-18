import { Event, EventToRecord, makeEventFactory } from "@valkyr/ledger";

export const userCreated = makeEventFactory<UserCreated>("UserCreated");
export const userNameSet = makeEventFactory<UserNameSet>("UserNameSet");
export const userEmailSet = makeEventFactory<UserEmailSet>("UserEmailSet");

type UserCreated = Event<"UserCreated", { name: string; email: string }>;
type UserNameSet = Event<"UserNameSet", { name: string }>;
type UserEmailSet = Event<"UserEmailSet", { email: string }>;

export type UserEvent = EventToRecord<UserCreated | UserNameSet | UserEmailSet>;
