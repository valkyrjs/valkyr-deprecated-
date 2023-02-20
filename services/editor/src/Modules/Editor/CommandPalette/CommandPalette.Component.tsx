import { Combobox } from "@headlessui/react";
import { Folder, MagnifyingGlass } from "phosphor-react";

import { Modal } from "~Components/Modal";

import { CommandPaletteController } from "./CommandPalette.Controller";

function classNames(...classes: (string | boolean)[]) {
  return classes.filter(Boolean).join(" ");
}

export const CommandPalette = CommandPaletteController.view(
  ({ state: { blocks, actions, query }, actions: { setQuery } }) => {
    return (
      <Modal title="Library" mode="full">
        <div className="bg-darker mx-auto w-full transform divide-y divide-gray-500 divide-opacity-20 overflow-hidden rounded-xl shadow-2xl transition-all">
          <Combobox onChange={(item: any) => item.add()}>
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
            {(query === "" || blocks.length > 0) && (
              <Combobox.Options
                static
                className="max-h-80 scroll-py-2 divide-y divide-gray-500 divide-opacity-20 overflow-y-auto"
              >
                <li className="p-2">
                  {query === "" && (
                    <h2 className="mt-4 mb-2 px-3 text-xs font-semibold text-gray-200">Recent blocks</h2>
                  )}
                  <ul className="text-sm text-gray-400">
                    {blocks.map((block) => (
                      <Combobox.Option
                        key={block.name}
                        value={block}
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

                            <span className="ml-3 flex-auto truncate">{block.name}</span>
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
                      {actions.map((action) => (
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

            {query !== "" && blocks.length === 0 && (
              <div className="py-14 px-6 text-center sm:px-14">
                <Folder className="mx-auto h-6 w-6 text-gray-500" aria-hidden="true" />
                <p className="mt-4 text-sm text-gray-200">No blocks found, try again.</p>
              </div>
            )}
          </Combobox>
        </div>
      </Modal>
    );
  }
);
