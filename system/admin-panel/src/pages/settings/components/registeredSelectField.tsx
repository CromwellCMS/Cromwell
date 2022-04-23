import React from "react";
import {
  Controller,
  useFormContext,
} from "react-hook-form";
import {
  SelectInputField,
  SelectInputProps,
} from "../../../components/forms/inputs/selectInput";

type PropTypes<T> = SelectInputProps<T> & {
  label?: string;
  name?: string;
  inferValue?: (v: any) => any
};

export const RegisteredSelectField = <T extends unknown>({
  options,
  getLabel,
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
      <p className="font-bold pb-1 pl-[2px] text-gray-700">
        {label}
      </p>
      <Controller
        name={name}
        control={control}
        render={({ field }) => {
          return (
            <SelectInputField<T>
              disabled={disabled}
              value={inferValue(field.value)}
              onChange={(v) => {
                field.onChange(v);
              }}
              options={options}
              getLabel={getLabel}
              getValue={getValue}
              className={className}
            />
          );
        }}
      />
    </div>
  );
};
