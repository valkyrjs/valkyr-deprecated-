import { Disclosure } from "@headlessui/react";

import { BlockHeader } from "~Components/BlockHeader";
import { Editable } from "~Components/Editable";
import { TypeFields } from "~Components/TypeFields";

import { StateNodeController } from "./StateBlock.Controller";

export const StateBlock = StateNodeController.view(({ state: { state, data }, actions: { setName, onRemove } }) => {
  if (state === undefined) {
    return <div>404 State Block Not Found</div>;
  }
  return (
    <div className="relative">
      <Disclosure defaultOpen={true}>
        {({ open }) => (
          <div className="bg-darker border-darker-800 min-w-[390px] rounded-sm border font-mono text-xs">
            <BlockHeader
              open={open}
              onRemove={onRemove}
              color="magenta"
              symbol="S"
              content={<Editable value={state.name} onChange={setName} name="name" placeholder="Add state name" />}
            />
            <Disclosure.Panel>
              <TypeFields
                data={state.data}
                addField={data.addField}
                setFieldKey={data.setFieldKey}
                setFieldValue={data.setFieldValue}
                removeField={data.removeField}
              />
            </Disclosure.Panel>
          </div>
        )}
      </Disclosure>
    </div>
  );
});
