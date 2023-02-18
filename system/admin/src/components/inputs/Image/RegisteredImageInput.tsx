import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

import { ImageInput, ImageInputProps } from './ImageInput';

export function RegisteredImageInput({ name, ...props }: ImageInputProps & { name: string }) {
  const { control } = useFormContext();
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => {
        return <ImageInput {...props} value={field.value} onChange={field.onChange} />;
      }}
    />
  );
}
