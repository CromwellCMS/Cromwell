import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { ImageInput, ImageInputProps } from './ImageInput';

export function RegisteredImageInput<T extends Record<string, any>>({
  name,
  ...props
}: ImageInputProps & { name: keyof T }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name as any}
      control={control}
      render={({ field }) => {
        return <ImageInput {...props} value={field.value} onChange={field.onChange} />;
      }}
    />
  );
}
