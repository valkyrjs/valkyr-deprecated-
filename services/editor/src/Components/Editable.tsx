import { PencilSimple } from "phosphor-react";
import { DetailedHTMLProps, InputHTMLAttributes, useEffect, useRef, useState } from "react";

type Props = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export function Editable({ name, value, onChange, placeholder, ...props }: Props) {
  const [isEditing, setEditing] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    if (inputRef && inputRef.current && isEditing === true) {
      inputRef.current.focus();
    }
  }, [isEditing, inputRef]);

  const handleKeyDown = (event: any) => {
    const { key } = event;
    const allKeys = ["Escape"];
    if (allKeys.indexOf(key) > -1) {
      setEditing(false);
    }
  };

  return (
    <section {...props}>
      {isEditing ? (
        <div onBlur={() => setEditing(false)} onKeyDown={(e) => handleKeyDown(e)}>
          <input
            ref={inputRef}
            type="text"
            name={name}
            className="border-darker-700 text-light focus:shadow-outline m-0 w-full border bg-transparent py-1 px-1.5 leading-tight shadow focus:outline-none"
            placeholder={placeholder}
            defaultValue={value}
            onBlur={onChange}
          />
        </div>
      ) : (
        <div
          className={`text-light hover:shadow-outline flex w-full items-center justify-between whitespace-pre-wrap rounded border border-transparent py-1 px-1.5 leading-tight`}
          onClick={() => setEditing(true)}
        >
          <span className={`${value ? "text-light" : "text-darker-200"}`}>
            {value || placeholder || "Editable content"}
          </span>
        </div>
      )}
    </section>
  );
}
