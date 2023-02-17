import { Plus } from "phosphor-react";

import { UnstyledButton } from "~Components/UnstyledButton";

import { EventList } from "../Components/EventList.Component";
import { createEvent } from "../Data/Event.Collection";
import { EventsController } from "./Events.Controller";

export const EventsView = EventsController.view(({ state: { groups, form } }) => {
  return (
    <div className="flex flex-col justify-center p-5">
      <div className="mb-4">
        <form className="flex" onSubmit={form.submit}>
          <input
            className="block w-full min-w-0 flex-1 rounded-none rounded-l-lg border border-gray-600 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:outline-none"
            placeholder="Accounts, Users, Groups, etc."
            {...form.register("name")}
          />
          <UnstyledButton className="inline-flex items-center rounded-r-md border border-r-0 border-gray-300 bg-gray-200 px-3 text-gray-900 dark:border-gray-600 dark:bg-gray-600 dark:text-gray-400">
            Add Event Group
          </UnstyledButton>
        </form>
      </div>
      <div className="columns-3">
        {groups.map((group) => (
          <div key={group.id} className="relative mb-10 overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-left text-sm text-gray-500 dark:text-gray-400">
              <caption className="bg-white p-5 text-left text-lg font-semibold text-gray-900 dark:bg-gray-800 dark:text-white">
                {group.name}
                <UnstyledButton
                  className="ml-2 text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
                  onClick={() => createEvent(group.id)}
                >
                  <Plus /> Add Event
                </UnstyledButton>
                <p className="mt-1 text-sm font-normal text-gray-500 dark:text-gray-400">
                  Some description about the category and its events.
                </p>
              </caption>
              <tbody>
                <EventList groupId={group.id} />
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
});
