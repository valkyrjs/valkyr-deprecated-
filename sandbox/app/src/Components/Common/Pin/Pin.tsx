import React from "react";

import type { InputsRef } from "../../../Hooks/UsePin";
import s from "./Pin.module.scss";

type Props = {
  inputs: InputsRef;
  className?: string;
  size?: number;
  disabled?: boolean;
  onComplete?: () => void;
};

export function Pin({ inputs, className = "", size = 5, disabled = false, onComplete }: Props): JSX.Element {
  return (
    <div className={`${s.container} ${className}`.trim()}>
      {Array.from(Array(size)).map((_, index) => (
        <input
          key={index}
          ref={(component) => {
            if (component !== null) {
              inputs.current.set(index, component);
            }
          }}
          className={s.input}
          maxLength={1}
          disabled={disabled}
          onPaste={(e) => {
            e.preventDefault();
            if (typeof navigator.clipboard.readText === "function") {
              navigator.clipboard.readText().then((text) => {
                text.split("").forEach((value, index) => {
                  const input = inputs.current.get(index);
                  if (input) {
                    input.blur();
                    input.value = value;
                  }
                });
              });
            }
          }}
          onKeyUp={({ key }) => {
            if (key === "Backspace") {
              const nextIndex = index - 1;
              const hasValue = inputs.current.has(index) && inputs.current.get(index)?.value !== "";
              if (!hasValue && nextIndex > -1) {
                inputs.current.get(nextIndex)?.focus();
              }
            } else {
              const hasValue = inputs.current.has(index) && inputs.current.get(index)?.value !== "";
              if (hasValue) {
                const nextIndex = index + 1;
                if (nextIndex < size) {
                  inputs.current.get(nextIndex)?.focus();
                }
              }
            }
          }}
          onFocus={() => {
            inputs.current.get(index)?.select();
          }}
          onChange={() => {
            if (onComplete) {
              let isComplete = true;
              for (const key of inputs.current.keys()) {
                if (inputs.current.get(key)?.value === "") {
                  isComplete = false;
                  break;
                }
              }
              if (isComplete) {
                onComplete();
              }
            }
          }}
        />
      ))}
    </div>
  );
}
