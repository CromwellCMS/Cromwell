import { TPermission } from '@cromwell/core';
import { Switch } from '@headlessui/react';
import React from 'react';
import { Controller, useFormContext } from 'react-hook-form';

export const ControlledPermissionOption = ({ name = '', data = null }: { name: string; data?: TPermission }) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <PermissionOption
          value={field.value}
          onChange={field.onChange}
          label={data?.title}
          description={data?.description}
        />
      )}
    />
  );
};

const PermissionOption = ({
  value = false,
  onChange = () => false,
  label = '',
  readerText = 'Use setting',
  description = '',
}: {
  value?: boolean;
  onChange?: (v?: boolean) => any;
  readerText?: string;
  label?: any;
  description?: any;
}) => {
  return (
    <div className="h-full w-full">
      <Switch checked={value} onChange={onChange} className="h-full w-full">
        <div
          className={`border rounded-lg shadow-md m-2 w-full h-full p-3 relative ${
            value ? 'shadow-indigo-400 border-indigo-500' : 'bg-white'
          }`}
        >
          <div
            className={`${value ? 'bg-indigo-800' : 'bg-gray-500'}
          absolute right-1 top-1 inline-flex flex-shrink-0 h-[16px] w-[32px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
          >
            <span className="sr-only">{readerText}</span>
            <span
              aria-hidden="true"
              className={`${value ? 'translate-x-[15px]' : 'translate-x-0'}
              pointer-events-none inline-block h-[12px] w-[12px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
            />
          </div>
          <p className="text-base text-left">{label}</p>
          <p className="text-xs text-left text-gray-500">{description}</p>
        </div>
      </Switch>
    </div>
  );
};
