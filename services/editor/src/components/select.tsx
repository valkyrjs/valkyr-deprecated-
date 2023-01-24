import { Listbox, Transition } from "@headlessui/react";
import { CaretDown, Check } from "phosphor-react";
import { Fragment, useState } from "react";

const types = [
  { id: 1, name: "string" },
  { id: 2, name: "number" },
  { id: 3, name: "boolean" }
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function Select() {
  const [selected, setSelected] = useState(types[0]);

  return (
    <Listbox value={selected} onChange={setSelected}>
      {({ open }) => (
        <div className="relative">
          <Listbox.Button className="text-xs font-mono relative w-44 cursor-default rounded border border-gray-200 bg-transparent py-1 pl-1.5 pr-10 text-left shadow-sm focus:border-cta-hover focus:outline-none focus:ring-1 focus:ring-cta-hover sm:text-sm">
            <span className="block truncate">{selected?.name}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <CaretDown className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>

          <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-gray-200 py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {types.map((t) => (
                <Listbox.Option
                  key={t.id}
                  className={({ active }) =>
                    classNames(
                      active ? "text-white bg-cta-default" : "text-gray-900",
                      "relative cursor-default select-none py-2 pl-3 pr-9"
                    )
                  }
                  value={t}
                >
                  {({ selected, active }) => (
                    <>
                      <span className={classNames(selected ? "font-semibold" : "font-normal", "block truncate")}>
                        {t.name}
                      </span>

                      {selected ? (
                        <span
                          className={classNames(
                            active ? "text-white" : "text-cta-default",
                            "absolute inset-y-0 right-0 flex items-center pr-4"
                          )}
                        >
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
}
