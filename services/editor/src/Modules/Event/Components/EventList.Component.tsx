import { EventBlock } from "./EventBlock.Component";
import { EventListController } from "./EventList.Controller";

export const EventList = EventListController.view(({ state: { events } }) => {
  return (
    <>
      {events.map((event) => (
        <tr key={event.id} className="border-b bg-white dark:border-gray-700 dark:bg-gray-800">
          <td>
            <EventBlock id={event.id} />
          </td>
        </tr>
      ))}
    </>
  );
});
