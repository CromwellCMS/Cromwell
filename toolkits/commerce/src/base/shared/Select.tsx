import { getRandStr } from '@cromwell/core';
import React, { useRef } from 'react';

export type TSelectProps = {
  options?: ({
    value: string | number | undefined;
    label: string;
  } | string | number | undefined)[];
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;
  style?: React.CSSProperties;
  className?: string;
  label?: string;
  name?: string;
  value?: string;
  id?: string;
}
export type TBaseSelect = React.ComponentType<TSelectProps>;

export const BaseSelect = (props: TSelectProps) => {
  const { name, label, style, className, onChange } = props;
  const id = useRef(props.id || getRandStr(8));
  return (
    <div style={style} className={className}>
      <p>{label ?? ''}</p>
      <label htmlFor={id.current}>{props.label}</label>
      <select name={name ?? id.current} id={id.current}
        onChange={onChange}
      >
        {props.options?.map((option) => {
          const label = typeof option === 'object' ? option.label : option;
          const value = typeof option === 'object' ? option.value : option;
          return (
            <option value={value} key={value}>{label}</option>
          )
        })}
      </select>
    </div>
  )
}