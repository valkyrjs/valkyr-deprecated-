import { Plus, XSquare } from "phosphor-react";

import { Select } from "./select";
import { UnstyledButton } from "./unstyled-button";

type Props = {
  data: [string, string][];
  addField: () => void;
  setFieldKey: (index: number) => (...args: any[]) => void;
  setFieldValue: (index: number) => (value: string) => void;
  removeField: (index: number) => () => void;
};

export function TypeFields({ data, addField, setFieldKey, setFieldValue, removeField }: Props) {
  return (
    <section className="p-2 flex flex-col gap-2">
      <form className="flex flex-col gap-1">
        {data.map(([key, value], index) => (
          <div key={index} className="flex flex-row gap-2">
            <UnstyledButton className="text-darker-700 hover:text-darker-600" onClick={removeField(index)}>
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
        <UnstyledButton className="w-full flex justify-start items-center text-xs" onClick={addField}>
          <Plus size={8} /> more
        </UnstyledButton>
      </div>
    </section>
  );
}
