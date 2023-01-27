import { Pencil, PencilSimple } from "phosphor-react";
import React, { useEffect, useRef, useState } from "react";

export function Editable({ name, value, onChange, placeholder, ...props }) {
  const [isEditing, setEditing] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    if (inputRef && inputRef.current && isEditing === true) {
      inputRef.current.focus();
    }
  }, [isEditing, inputRef]);

  const handleKeyDown = (event) => {
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
            className="shadow m-0 bg-transparent border border-darker-700 w-full py-1 px-1.5 text-light leading-tight focus:outline-none focus:shadow-outline"
            placeholder={placeholder}
            defaultValue={value}
            onBlur={onChange}
          />
        </div>
      ) : (
        <div
          className={`rounded py-1 px-1.5 text-light border border-transparent leading-tight whitespace-pre-wrap hover:shadow-outline w-full flex items-center justify-between`}
          onClick={() => setEditing(true)}
        >
          <span className={`${value ? "text-light" : "text-light-200"}`}>
            {value || placeholder || "Editable content"}
          </span>
          <PencilSimple size={10} className="text-darker-700 hover:text-darker-600" />
        </div>
      )}
    </section>
  );
}
