import React, { MutableRefObject, useRef } from "react";
import styled from "styled-components";

/*
 |--------------------------------------------------------------------------------
 | Types
 |--------------------------------------------------------------------------------
 */

export type Inputs = Map<number, HTMLInputElement>;
export type InputsRef = MutableRefObject<Inputs>;

export type Actions = {
  clear(): void;
  focus(index: number): void;
  data(): string;
};

type Props = {
  inputs: InputsRef;
  className?: string;
  size?: number;
  disabled?: boolean;
  onComplete?: () => void;
};

/*
 |--------------------------------------------------------------------------------
 | Component
 |--------------------------------------------------------------------------------
 */

export function Pin({ inputs, className, size = 5, disabled = false, onComplete }: Props): JSX.Element {
  return (
    <S.Container className={className}>
      {Array.from(Array(size)).map((_, index) => (
        <input
          key={index}
          ref={(component) => {
            if (component !== null) {
              inputs.current.set(index, component);
            }
          }}
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
    </S.Container>
  );
}

/*
 |--------------------------------------------------------------------------------
 | Styles
 |--------------------------------------------------------------------------------
 */

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: row;
    input {
      text-align: center;
    }
  `
};

/*
 |--------------------------------------------------------------------------------
 | Hooks
 |--------------------------------------------------------------------------------
 */

export function usePin(): [InputsRef, Actions] {
  const inputs = useRef<Inputs>(new Map());
  return [
    inputs,
    {
      clear() {
        inputs.current.forEach((input) => {
          input.value = "";
        });
      },
      focus(index: number) {
        inputs.current.get(index)?.focus();
      },
      data(): string {
        let data = "";
        for (const key of inputs.current.keys()) {
          const value = inputs.current.get(key)?.value;
          if (value) {
            data += value;
          }
        }
        return data;
      }
    }
  ];
}
