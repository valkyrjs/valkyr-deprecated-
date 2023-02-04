import { Plus, XSquare } from "phosphor-react";

import { BlockField } from "../Modules/Editor/Library/Utilities/BlockFields";
import { Select } from "./Select";
import { UnstyledButton } from "./UnstyledButton";

type Props = {
  data: BlockField[];
  addField: () => void;
  setFieldKey: (index: number) => (event: any) => void;
  setFieldValue: (index: number) => (value: string) => void;
  removeField: (index: number) => () => void;
};

export function TypeFields({ data, addField, setFieldKey, setFieldValue, removeField }: Props) {
  return (
    <section className="flex flex-col gap-2 p-2">
      <form className="flex flex-col gap-1" onSubmit={(e) => e.preventDefault()}>
        {data.map(([key, value], index) => (
          <div key={index} className="flex flex-row gap-2">
            <UnstyledButton className="text-darker-400 hover:text-red-300" onClick={removeField(index)}>
              <XSquare size={16} />
            </UnstyledButton>
            <div className="form-control">
              <input id={`data.${index}`} name={`data.${index}`} defaultValue={key} onBlur={setFieldKey(index)} />
            </div>
            <div className="form-control">
              <Select selected={value} onSelect={setFieldValue(index)} />
            </div>
          </div>
        ))}
      </form>
      <div className="form-actions">
        <UnstyledButton
          className="text-darker-500 hover:text-yellow flex w-full items-center justify-start text-xs"
          onClick={addField}
        >
          <Plus size={8} /> more
        </UnstyledButton>
      </div>
    </section>
  );
}