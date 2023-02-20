import { Disclosure } from "@headlessui/react";

import { BlockHeader } from "~Components/BlockHeader";
import { CodeEditor } from "~Components/CodeEditor";

import { TypeBlockController } from "./TypeBlock.Controller";

export const TypeBlock = TypeBlockController.view(({ state: { type }, actions: { onChange, onRemove } }) => {
  if (type === undefined) {
    return <div>404 Type Block Not Found</div>;
  }
  return (
    <div className="relative">
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <div className="bg-darker border-darker-800 w-full rounded-sm border font-mono text-xs">
            <BlockHeader
              open={open}
              draggable={false}
              onRemove={onRemove}
              color="green"
              symbol="T"
              content={type.name}
            />
            <Disclosure.Panel>
              <div
                className="border-b-darker-800 border-b"
                style={{
                  height: 200
                }}
              >
                <CodeEditor defaultValue={type.value} onChange={onChange} />
              </div>
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>
    </div>
  );
});
