import { Dialog, Transition } from "@headlessui/react";
import { CaretDoubleRight, Plus } from "phosphor-react";
import { Fragment } from "react";

import { createTypeBlock } from "~Blocks/Type";
import { TypeBlock } from "~Blocks/Type/Type.Component";
import { Button } from "~Components/Button";
import { Panel } from "~Components/Panel";

import { SettingsController } from "./Settings.Controller";

export const Settings = SettingsController.view(({ state: { types }, props: { isOpen, setClosed } }) => {
  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="text-light relative z-10" onClose={setClosed}>
        <div id="settings" className="pointer-events-none fixed inset-y-0 right-0 flex pl-10 sm:pl-16">
          <Transition.Child
            as={Fragment}
            enter="transform transition ease-in-out duration-150"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transform transition ease-in-out duration-150"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="pointer-events-auto w-96">
              <div className="bg-darker flex h-full flex-col overflow-y-scroll shadow-xl">
                <div className="border-darker-700 bg-darker-800 border-b p-3">
                  <div className="flex items-center justify-between gap-6">
                    <Dialog.Title className="text-pink text-sm">SETTINGS</Dialog.Title>
                    <Button variant="primary" outline type="button" onClick={setClosed}>
                      <CaretDoubleRight size={16} />
                    </Button>
                  </div>
                </div>
                <Panel title="Configuration" defaultOpen={true}>
                  <div className="flex w-full flex-col gap-2 p-6 text-sm">
                    <div className="mb-2">
                      <header className="text-darker-700 tracking-wide">App</header>
                      <div className="flex flex-col gap-2 font-mono">
                        <span>Name</span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <header className="text-darker-700 tracking-wide">Administrator</header>
                      <div className="flex flex-col gap-2 font-mono">
                        <span>Username</span>
                        <span>Password</span>
                      </div>
                    </div>
                    <div className="mb-2">
                      <header className="text-darker-700 tracking-wide">Mongo Database</header>
                      <div className="flex flex-col gap-2 font-mono">
                        <span>Name</span>
                        <span>Connection</span>
                      </div>
                    </div>
                  </div>
                </Panel>
                <Panel title="Types" defaultOpen={true}>
                  {types.map((type) => (
                    <TypeBlock key={type.id} id={type.id} />
                  ))}
                  <div className="mt-6 flex w-full flex-row justify-end px-2">
                    <Button
                      variant="primary"
                      outline
                      type="button"
                      onClick={() => {
                        createTypeBlock();
                      }}
                    >
                      <Plus size={12}></Plus>
                      <span>type</span>
                    </Button>
                  </div>
                </Panel>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
});
