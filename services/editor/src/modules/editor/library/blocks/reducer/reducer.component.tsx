import { Disclosure } from "@headlessui/react";

import { BlockHeader } from "~components/block-header";
import { CodeEditor } from "~components/code-editor";

import { ReducerNodeController } from "./reducer.controller";

export const ReducerBlock = ReducerNodeController.view(
  ({ state: { block, model }, actions: { onChange, onRemove } }) => {
    if (block === undefined) {
      return <div>404 Block Not Found</div>;
    }
    return (
      <div className="relative">
        <Disclosure defaultOpen={true}>
          {({ open }) => (
            <div className="bg-darker border-darker-800 min-w-[390px] rounded-sm border font-mono text-xs">
              <BlockHeader open={open} color="cyan" symbol="R" content="Reducer" onRemove={onRemove} />
              <Disclosure.Panel>
                <div
                  className="border-b-darker-800 border-b"
                  style={{
                    width: 640,
                    height: 400
                  }}
                >
                  <CodeEditor defaultValue={block.code} model={model} onChange={onChange} />
                </div>
              </Disclosure.Panel>
            </div>
          )}
        </Disclosure>
      </div>
    );
  }
);
