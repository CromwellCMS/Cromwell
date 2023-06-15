import React from 'react';
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form';

import { SwitchInput, SwitchInputProps } from './SwitchInput';

export function RegisteredSwitchInput<TData = Record<string, any>>({
  name,
  registerOptions,
  ...props
}: Omit<SwitchInputProps, 'name'> & { name: keyof TData; registerOptions?: RegisterOptions<TData> }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name as any}
      control={control}
      rules={registerOptions as any}
      render={({ field }) => {
        return <SwitchInput {...props} value={field.value} onChange={props?.onChange || field.onChange} />;
      }}
    />
  );
}
