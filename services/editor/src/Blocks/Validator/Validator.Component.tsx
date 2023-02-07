import { Disclosure } from "@headlessui/react";

import { CodeEditor } from "~Components/CodeEditor";

import { ValidatorHeader } from "./Components/ValidatorHeader.Component";
import { ValidatorController } from "./Validator.Controller";

export const ValidatorBlock = ValidatorController.view(({ state: { block }, actions: { onChange, onRemove } }) => {
  if (block === undefined) {
    return <div>404 Block Not Found</div>;
  }
  return (
    <div className="relative">
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <div className="bg-darker border-darker-800 min-w-[390px] rounded-sm border font-mono text-xs">
            <ValidatorHeader eventId={block.event} open={open} onRemove={onRemove} />
            <Disclosure.Panel>
              <div
                className="border-b-darker-800 border-b"
                style={{
                  width: 640,
                  height: 400
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
