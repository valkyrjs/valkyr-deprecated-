import { Disclosure } from "@headlessui/react";

import { CodeEditor } from "~Components/CodeEditor";

import { ReducerBlockController } from "./ReducerBlock.Controller";
import { ReducerHeader } from "./ReducerHeader.Component";

export const ReducerBlock = ReducerBlockController.view(({ state: { reducer }, actions: { onChange, onRemove } }) => {
  if (reducer === undefined) {
    return <div>404 Reducer Block Not Found</div>;
  }
  return (
    <div className="relative">
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <div className="bg-darker border-darker-800 min-w-[390px] rounded-sm border font-mono text-xs">
            <ReducerHeader stateId={reducer.state} open={open} onRemove={onRemove} />
            <Disclosure.Panel>
              <div
                className="border-b-darker-800 border-b"
                style={{
                  width: 640,
                  height: 400
                }}
              >
                <CodeEditor defaultValue={reducer.value} onChange={onChange} />
              </div>
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>
    </div>
  );
});
