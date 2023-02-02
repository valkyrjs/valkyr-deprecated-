import { Disclosure } from "@headlessui/react";

import { BlockHeader } from "~Components/BlockHeader";
import { CodeEditor } from "~Components/CodeEditor";

import { ReducerNodeController } from "./Reducer.Controller";

export const ReducerBlock = ReducerNodeController.view(
  ({ state: { block, state, model }, actions: { onChange, onRemove } }) => {
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
                color="cyan"
                symbol="R"
                content={`${state?.name ?? ""} Reducer`}
                onRemove={onRemove}
              />
              <Disclosure.Panel>
                <div
                  className="border-b-darker-800 border-b"
                  style={{
                    width: 640,
                    height: 400
                  }}
                >
                  <CodeEditor defaultValue={block.value} model={model} onChange={onChange} />
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
      </div>
    );
  }
);
