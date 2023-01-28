import React from 'react';
import { Controller, useFormContext, FieldPath, FieldValues } from 'react-hook-form';

import { TextInput, TextInputProps } from './TextInput';

export function RegisteredTextInput<
  TFieldValues extends FieldValues = FieldValues,
  TFieldName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
>({ name, ...props }: Omit<TextInputProps, 'name'> & { name: TFieldName }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return <TextInput {...props} value={field.value} onChange={field.onChange} />;
      }}
    />
  );
}
