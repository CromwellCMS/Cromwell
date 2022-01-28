import { getRandStr } from '@cromwell/core';
import React, { useRef } from 'react';

export type TRadioProps = {
  options?: ({
    value: string | number | undefined;
    label: string;
  } | string | number | undefined)[];
  onChange?: (event: React.ChangeEvent<HTMLInputElement>, value: string | number | undefined) => any;
  style?: React.CSSProperties;
  className?: string;
  name?: string;
  value?: string;
  id?: string;
}
export type TBaseRadio = React.ComponentType<TRadioProps>;

export const BaseRadio = (props: TRadioProps) => {
  const { name, style, className, options, onChange } = props;
  const id = useRef(props.id || getRandStr(8));

  return (
    <div style={style} className={className}>
      {options?.map((option) => {
        const label = typeof option === 'object' ? option.label : option;
        const value = typeof option === 'object' ? option.value : option;
        const optionId = getRandStr(10);
        return (
          <div key={value}>
            <input type="radio"
              id={optionId}
              name={name ?? id.current}
              checked={props.value === value}
              onChange={(e) => onChange?.(e, value)}
            />
            <label htmlFor={optionId}>{label}</label>
          </div>
        )
      })}
    </div>
  )
}