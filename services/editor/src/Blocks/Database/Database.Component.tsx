import { Disclosure } from "@headlessui/react";

import { BlockHeader } from "~Components/BlockHeader";
import { Editable } from "~Components/Editable";

import { DatabaseController } from "./Database.Controller";

export const DatabaseBlock = DatabaseController.view(({ state: { block }, actions: { setName, onRemove } }) => {
  if (block === undefined) {
    return <div>404 Block Not Found</div>;
  }
  return (
    <div className="relative">
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <div className="bg-darker border-darker-800 min-w-[390px] rounded-sm border font-mono text-xs">
            <BlockHeader
              open={open}
              onRemove={onRemove}
              color="green"
              symbol="D"
              content={<Editable value={block.name} onChange={setName} name="name" placeholder="Add event name" />}
            />
            <Disclosure.Panel>
              <div className="text-darker-400 border-b-darker-800 flex w-full items-center justify-between gap-2 border-b py-1 px-2">
                Config [Local]
              </div>
              <pre>{JSON.stringify(block.config, null, 2)}</pre>
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>
    </div>
  );
});
