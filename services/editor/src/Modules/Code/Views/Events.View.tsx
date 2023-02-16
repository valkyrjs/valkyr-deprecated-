import { addBlock } from "~Blocks/Block.Collection";
import { EventBlock } from "~Blocks/Event";
import { Button } from "~Components/Button";

import { EventsController } from "./Events.Controller";

export const EventsView = EventsController.view(({ state: { events } }) => {
  return (
    <div className="p-5">
      <div className="mb-4">
        <Button onClick={() => addBlock("event", {})}>Add Event</Button>
      </div>
      <div className="flex flex-row flex-wrap-reverse">
        {events.map((event) => (
          <div className="mb-4 mr-4 max-w-md">
            <EventBlock key={event.id} id={event.id} />
          </div>
        ))}
      </div>
    </div>
  );
});
