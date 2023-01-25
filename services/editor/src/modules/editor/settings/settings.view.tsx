import { Dialog, Menu, Transition } from "@headlessui/react";
import { DotsThreeVertical, X } from "phosphor-react";
import { Fragment } from "react";

import { UnstyledButton } from "~components/unstyled-button";

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Settings({ isOpen, setClosed }: { isOpen: boolean; setClosed: any }) {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative text-light z-10" onClose={setClosed}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <div className="flex h-full flex-col overflow-y-scroll bg-darker shadow-xl">
                    <div className="p-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-sm text-light">SETTINGS</Dialog.Title>
                        <div className="ml-3 flex h-7 items-center">
                          <UnstyledButton onClick={() => setClosed(false)}>
                            <X className="w-4 h-4 text-darker-700 hover:text-darker-600" />
                          </UnstyledButton>
                        </div>
                      </div>
                    </div>
                    <section>
                      <header>
                        <h6>App Settings</h6>
                      </header>
                      <div className="flex flex-col gap-2">
                        <span>Name</span>
                        <span>???</span>
                      </div>
                    </section>
                    <section>
                      <header>
                        <h6>Types</h6>
                      </header>
                      <div className="flex flex-col gap-2"></div>
                    </section>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
