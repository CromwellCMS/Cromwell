import React from 'react';
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form';

import { getFieldErrorMessageFromState } from '../utils';
import { TextInput, TextInputProps } from './TextInput';

export function RegisteredTextInput<TData = Record<string, any>>({
  name,
  registerOptions,
  ...props
}: Omit<TextInputProps, 'name'> & { name: keyof TData; registerOptions?: RegisterOptions<TData> }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name as any}
      control={control}
      rules={registerOptions as any}
      render={({ field, formState }) => {
        return (
          <TextInput
            {...props}
            error={getFieldErrorMessageFromState(name as string, formState)}
            value={field.value}
            onChange={props?.onChange || field.onChange}
          />
        );
      }}
    />
  );
}
