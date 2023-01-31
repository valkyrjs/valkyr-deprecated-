import { Disclosure } from "@headlessui/react";

import { BlockHeader } from "~Components/BlockHeader";
import { Editable } from "~Components/Editable";
import { TypeFields } from "~Components/TypeFields";

import { TypeBlockController } from "./Type.Controller";

export const TypeBlock = TypeBlockController.view(({ state: { block, data }, actions: { setName, onRemove } }) => {
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
              symbol="T"
              content={<Editable value={block.name} onChange={setName} name="name" placeholder="Add type name" />}
            />
            <Disclosure.Panel>
              <TypeFields
                data={block.data}
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
