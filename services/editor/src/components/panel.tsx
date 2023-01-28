import { Disclosure, Transition } from "@headlessui/react";
import { CaretUp } from "phosphor-react";
import React from "react";

export function Panel({
  title,
  defaultOpen = false,
  children
}: React.PropsWithChildren<{ title: string; defaultOpen: boolean }>) {
  return (
    <Disclosure as="section" defaultOpen={defaultOpen}>
      {({ open }) => (
        <>
          <Disclosure.Button
            as="header"
            className="bg-darker-800 flex flex-row justify-between px-4 py-2 text-cyan-400 "
          >
            <h6 className="text-sm uppercase">{title}</h6>
            <CaretUp
              className={open ? "w-7 rotate-180 transition duration-75" : "w-7 transition duration-75"}
              size={16}
            />
          </Disclosure.Button>
          <Transition
            show={open}
            enter="transition duration-75 ease-out"
            enterFrom="transform scale-y-0"
            enterTo="transform scale-y-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-y-100"
            leaveTo="transform scale-y-0"
          >
            <Disclosure.Panel as="div" className="flex w-full flex-col gap-2 p-6 text-sm" static>
              {children}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
