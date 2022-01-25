import React, { InputHTMLAttributes, useEffect, useRef } from "react";

import { forms } from "../../../../Lib/Forms";
import { Label } from "../Label";
import s from "./Input.module.css";

export type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  id?: string;
  name?: string;
  label?: string;
  innerText?: string;
  flex?: number;
  maxWidth?: number | string;
  disabled?: boolean;
  onChange: (value: string) => void;
};

export const Input = React.forwardRef<HTMLInputElement, Props>((props, ref) => {
  const { id, name, label, innerText, flex = 1, disabled = false, onChange, ...options } = props;
  const innerRef = useRef<HTMLInputElement>(ref as any);

  useEffect(() => {
    return forms.subscribe("focus", (fid: string, target?: string) => {
      if (id === fid && name === target) {
        innerRef.current.focus();
      }
    });
  }, [id, name, ref]);

  useEffect(() => {
    return forms.subscribe("clear", (fid: string, target?: string) => {
      if (id === fid && name === target) {
        // innerRef.current.
      }
    });
  }, [id, name, ref]);

  return (
    <div className={s.container} style={{ flex }}>
      <Label value={label} />
      {innerText !== undefined ? (
        <div className={s.inline}>
          <div className={s.inlineText}>{innerText}</div>
          <input
            ref={innerRef}
            {...options}
            disabled={disabled === false}
            className={s.input}
            onChange={({ target: { value } }) => {
              onChange(value);
            }}
          />
        </div>
      ) : (
        <input
          ref={innerRef}
          {...options}
          className={s.input}
          onChange={({ target: { value } }) => {
            onChange(value);
          }}
        />
      )}
    </div>
  );
});
