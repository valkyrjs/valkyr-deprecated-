import { Combobox, Dialog, Transition } from "@headlessui/react";
import { FilePlus, Folder, FolderPlus, Hash, MagnifyingGlass, Tag } from "phosphor-react";
import { Fragment, useState } from "react";

const projects = [
  { id: 1, name: "TaskAdded", url: "#" },
  { id: 2, name: "Task", url: "#" }
];

const recent = [projects[0]];
const quickActions = [
  { name: "Add new Event...", icon: "text-orange border-orange", shortcut: "E", url: "#" },
  { name: "Add new Reducer...", icon: "text-cyan border-cyan", shortcut: "R", url: "#" },
  { name: "Add new State...", icon: "text-pink border-pink", shortcut: "S", url: "#" },
  { name: "Add new Projection...", icon: "text-green border-green", shortcut: "P", url: "#" }
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function CommandPallete() {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(true);

  const filteredProjects =
    query === ""
      ? []
      : projects.filter((project) => {
          return project.name.toLowerCase().includes(query.toLowerCase());
        });

  return (
    <Transition.Root show={open} as={Fragment} afterLeave={() => setQuery("")} appear>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto p-4 sm:p-6 md:p-20">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="bg-darker mx-auto max-w-2xl transform divide-y divide-gray-500 divide-opacity-20 overflow-hidden rounded-xl shadow-2xl transition-all">
              <Combobox onChange={(item) => (window.location = item.url)}>
                <div className="relative">
                  <MagnifyingGlass
                    className="pointer-events-none absolute top-3.5 left-4 h-5 w-5 text-gray-500"
                    aria-hidden="true"
                  />
                  <Combobox.Input
                    className="h-12 w-full border-0 bg-transparent pl-11 pr-4 text-white placeholder-gray-500 outline-none focus:outline-none focus:ring-0 active:ring-0 sm:text-sm"
                    placeholder="Search..."
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </div>

                {(query === "" || filteredProjects.length > 0) && (
                  <Combobox.Options
                    static
                    className="max-h-80 scroll-py-2 divide-y divide-gray-500 divide-opacity-20 overflow-y-auto"
                  >
                    <li className="p-2">
                      {query === "" && (
                        <h2 className="mt-4 mb-2 px-3 text-xs font-semibold text-gray-200">Recent blocks</h2>
                      )}
                      <ul className="text-sm text-gray-400">
                        {(query === "" ? recent : filteredProjects).map((project) => (
                          <Combobox.Option
                            key={project.id}
                            value={project}
                            className={({ active }) =>
                              classNames(
                                "flex cursor-default select-none items-center rounded-md px-3 py-2",
                                active && "bg-gray-800 text-white"
                              )
                            }
                          >
                            {({ active }) => (
                              <>
                                <div
                                  className={classNames(
                                    "text-orange border-orange flex h-5 w-5 items-center justify-center rounded border font-mono text-xs text-opacity-30"
                                  )}
                                >
                                  E
                                </div>

                                <span className="ml-3 flex-auto truncate">{project.name}</span>
                                {active && <span className="ml-3 flex-none text-gray-400">Jump to...</span>}
                              </>
                            )}
                          </Combobox.Option>
                        ))}
                      </ul>
                    </li>
                    {query === "" && (
                      <li className="p-2">
                        <h2 className="sr-only">Quick actions</h2>
                        <ul className="text-light text-sm">
                          {quickActions.map((action) => (
                            <Combobox.Option
                              key={action.shortcut}
                              value={action}
                              className={({ active }) =>
                                classNames(
                                  "flex cursor-default select-none items-center rounded-md px-3 py-2",
                                  active && "bg-gray-800 text-white"
                                )
                              }
                            >
                              {({ active }) => (
                                <>
                                  <div
                                    className={classNames(
                                      "flex h-6 w-6 items-center justify-center rounded border",
                                      active ? action.icon : action.icon
                                    )}
                                  >
                                    {action.shortcut}
                                  </div>
                                  <span className="ml-3 flex-auto truncate">{action.name}</span>
                                  <span className="ml-3 flex-none text-xs font-semibold text-gray-400">
                                    <kbd className="font-sans">⌘</kbd>
                                    <kbd className="font-sans">{action.shortcut}</kbd>
                                  </span>
                                </>
                              )}
                            </Combobox.Option>
                          ))}
                        </ul>
                      </li>
                    )}
                  </Combobox.Options>
                )}

                {query !== "" && filteredProjects.length === 0 && (
                  <div className="py-14 px-6 text-center sm:px-14">
                    <Folder className="mx-auto h-6 w-6 text-gray-500" aria-hidden="true" />
                    <p className="mt-4 text-sm text-gray-200">
                      We couldn't find any projects with that term. Please try again.
                    </p>
                  </div>
                )}
              </Combobox>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
