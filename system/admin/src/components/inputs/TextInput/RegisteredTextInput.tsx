import React from 'react';
import { Controller, RegisterOptions, useFormContext } from 'react-hook-form';

import { TextInput, TextInputProps } from './TextInput';

const getFieldErrorFromState = (name: string, formState: any): { type: string; message: string } | undefined => {
  if (!formState?.errors) return;
  let error = formState?.errors;
  for (const key of name.split('.')) {
    if (!error[key]) return;
    error = error[key];
  }
  return error;
};

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
        const error = getFieldErrorFromState(name as string, formState);
        return (
          <TextInput
            {...props}
            error={error ? error?.message || 'Invalid field' : undefined}
            value={field.value}
            onChange={props?.onChange || field.onChange}
          />
        );
      }}
    />
  );
}
