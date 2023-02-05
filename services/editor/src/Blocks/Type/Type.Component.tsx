import { Disclosure } from "@headlessui/react";

import { BlockHeader } from "~Components/BlockHeader";
import { CodeEditor } from "~Components/CodeEditor";

import { TypeBlockController } from "./Type.Controller";

export const TypeBlock = TypeBlockController.view(({ state: { block }, actions: { onChange, onRemove } }) => {
  if (block === undefined) {
    return <div>404 Block Not Found</div>;
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
              content={block.name}
            />
            <Disclosure.Panel>
              <div
                className="border-b-darker-800 border-b"
                style={{
                  height: 200
                }}
              >
                <CodeEditor defaultValue={block.value} onChange={onChange} />
              </div>
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>
    </div>
  );
});
