import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { SelectInput, SelectInputProps } from '../../../components/inputs/SelectInput';

type PropTypes<T> = SelectInputProps<T> & {
  label?: string;
  name?: string;
  inferValue?: (v: any) => any;
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const RegisteredSelectField = <T extends unknown>({
  options,
  getDisplayValue,
  getValue,
  inferValue = (v) => v,
  label,
  name,
  className,
  disabled = false,
}: PropTypes<T>) => {
  const { control } = useFormContext();
  return (
    <div className="w-full">
      <p className="font-bold pb-1 pl-[2px] text-gray-700">{label}</p>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <SelectInput<T>
              disabled={disabled}
              value={inferValue(field.value)}
              onChange={(v) => {
                field.onChange(v);
              }}
              options={options}
              getDisplayValue={getDisplayValue}
              getValue={getValue}
              className={className}
            />
          );
        }}
      />
    </div>
  );
};
