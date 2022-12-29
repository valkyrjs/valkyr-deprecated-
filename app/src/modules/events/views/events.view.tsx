import { controller } from "./events.controller";

export const EventsView = controller.view(({ state: { events }, actions: { createUser } }) => {
  return (
    <div>
      <div>Events</div>
      <button onClick={createUser}>Create User</button>
      <pre>{JSON.stringify(events, null, 2)}</pre>
    </div>
  );
});
