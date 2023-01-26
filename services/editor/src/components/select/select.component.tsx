import { Listbox, Transition } from "@headlessui/react";
import { CaretDown, Check } from "phosphor-react";
import { Fragment } from "react";

import { SelectController } from "./select.controller";

export const Select = SelectController.view(({ state: { types, selected }, actions: { setSelected } }) => {
  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <div className="relative">
          <Listbox.Button className="relative w-44 cursor-default rounded border border-darker-800 bg-transparent py-1 pl-1.5 pr-10 text-left shadow-sm focus:border-darker-600 hover:border-darker-700">
            <span className="block truncate">{selected?.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <CaretDown className="h-5 w-5 text-darker-700 hover:text-darker-600" aria-hidden="true" />
            </span>
          </Listbox.Button>
          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute border border-darker-800 z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-darker-800 py-1 text-base shadow-lg  sm:text-sm">
              {types.map((t) => (
                <Listbox.Option
                  key={t.id}
                  className={({ active }) =>
                    classNames(
                      active ? "text-light bg-darker" : "text-darker-600",
                      "relative cursor-default select-none py-2 pl-3 pr-9"
                    )
                  }
                  value={t}
                >
                  {({ selected }) => (
                    <>
                      <span className={classNames(selected ? "text-cyan" : "text-light-200", "block truncate")}>
                        {t.name}
                      </span>
                      {selected ? (
                        <span className="text-cyan absolute inset-y-0 right-0 flex items-center pr-4">
                          <Check className="h-5 w-5" aria-hidden="true" />
                        </span>
                      ) : null}
                    </>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      )}
    </Listbox>
  );
});

function classNames(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
