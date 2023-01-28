import { Disclosure, Transition } from "@headlessui/react";
import { CaretUp } from "phosphor-react";

export function Panel({ title, children }) {
  return (
    <Disclosure as="section">
      {({ open }) => (
        <>
          <Disclosure.Button
            as="header"
            className="flex flex-row justify-between text-darker-400 px-4 py-2 bg-darker-800 "
          >
            <h6 className="uppercase text-sm">{title}</h6>
            <CaretUp
              className={open ? "w-7 transition duration-75 rotate-180" : "w-7 transition duration-75"}
              size={16}
            />
          </Disclosure.Button>
          <Transition
            show={open}
            enter="transition duration-100 ease-out"
            enterFrom="transform scale-x-95 opacity-0"
            enterTo="transform scale-x-100 opacity-100"
            leave="transition duration-75 ease-out"
            leaveFrom="transform scale-x-100 opacity-100"
            leaveTo="transform scale-x-95 opacity-0"
          >
            <Disclosure.Panel as="div" className="p-6 flex flex-col gap-2 text-sm" static>
              {children}
            </Disclosure.Panel>
          </Transition>
        </>
      )}
    </Disclosure>
  );
}
