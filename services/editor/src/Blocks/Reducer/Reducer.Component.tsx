import { Disclosure } from "@headlessui/react";

import { CodeEditor } from "~Components/CodeEditor";

import { ReducerHeader } from "./Components/ReducerHeader.Component";
import { ReducerNodeController } from "./Reducer.Controller";

export const ReducerBlock = ReducerNodeController.view(({ state: { block }, actions: { onChange, onRemove } }) => {
  if (block === undefined) {
    return <div>404 Block Not Found</div>;
  }
  return (
    <div className="relative">
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <div className="bg-darker border-darker-800 min-w-[390px] rounded-sm border font-mono text-xs">
            <ReducerHeader stateId={block.state} open={open} onRemove={onRemove} />
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
