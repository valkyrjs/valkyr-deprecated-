import { Disclosure } from "@headlessui/react";

import { CodeEditor } from "~Components/CodeEditor";

import { ValidatorController } from "./ValidatorBlock.Controller";
import { ValidatorHeader } from "./ValidatorHeader.Component";

export const ValidatorBlock = ValidatorController.view(({ state: { validator }, actions: { onChange, onRemove } }) => {
  if (validator === undefined) {
    return <div>404 Validator Block Not Found</div>;
  }
  return (
    <div className="relative">
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <div className="bg-darker border-darker-800 min-w-[390px] rounded-sm border font-mono text-xs">
            <ValidatorHeader eventId={validator.eventId} open={open} onRemove={onRemove} />
            <Disclosure.Panel>
              <div
                className="border-b-darker-800 border-b"
                style={{
                  width: 640,
                  height: 400
                }}
              >
                <CodeEditor defaultValue={validator.value} onChange={onChange} />
              </div>
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>
    </div>
  );
});
