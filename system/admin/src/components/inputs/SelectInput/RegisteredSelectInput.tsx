import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import { SelectInput, SelectInputProps } from './SelectInput';

type PropTypes<T> = SelectInputProps<T> & {
  name?: string;
};

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-constraint
export const RegisteredSelectInput = <T extends unknown>({ name, ...props }: PropTypes<T>) => {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        const value =
          props.options?.find((option) => props.getValue?.(option as any) === field.value || option === field.value) ||
          field.value;

        return <SelectInput<T> value={value} onChange={props?.onChange || field.onChange} {...props} />;
      }}
    />
  );
};
