import { Dialog, Transition } from "@headlessui/react";
import { X } from "phosphor-react";
import { Fragment } from "react";

import { Panel } from "~components/panel";
import { UnstyledButton } from "~components/unstyled-button";

import { TypeView } from "../library/nodes/type/type.component";
import { SettingsController } from "./settings.controller";

export const SettingsView = SettingsController.view(({ state: { types }, props: { isOpen, setClosed } }) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative text-light z-10" onClose={setClosed}>
        <div className="pointer-events-none fixed inset-y-0 right-0 flex pl-10 sm:pl-16">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-500 sm:duration-700"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-500 sm:duration-700"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="pointer-events-auto w-96">
              <div className="flex h-full flex-col overflow-y-scroll bg-darker shadow-xl">
                <div className="pt-6 pb-2 px-2 border-b border-darker-800">
                  <div className="flex items-start justify-between">
                    <Dialog.Title className="text-sm text-pink">SETTINGS</Dialog.Title>
                    <div className="ml-3 flex h-7 items-center">
                      <UnstyledButton onClick={() => setClosed()}>
                        <X className="w-4 h-4 text-darker-700 hover:text-darker-600" />
                      </UnstyledButton>
                    </div>
                  </div>
                </div>
                <Panel title="Configuration">
                  <div className="mb-2">
                    <header className="tracking-wide text-darker-700">App</header>
                    <div className="flex flex-col gap-2 font-mono">
                      <span>Name</span>
                    </div>
                  </div>
                  <div className="mb-2">
                    <header className="tracking-wide text-darker-700">Administrator</header>
                    <div className="flex flex-col gap-2 font-mono">
                      <span>Username</span>
                      <span>Password</span>
                    </div>
                  </div>
                  <div className="mb-2">
                    <header className="tracking-wide text-darker-700">Mongo Database</header>
                    <div className="flex flex-col gap-2 font-mono">
                      <span>Name</span>
                      <span>Connection</span>
                    </div>
                  </div>
                </Panel>
                <Panel title="Types">
                  {types.map((type) => (
                    <TypeView key={type.id} id={type.id} />
                  ))}
                </Panel>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
});
