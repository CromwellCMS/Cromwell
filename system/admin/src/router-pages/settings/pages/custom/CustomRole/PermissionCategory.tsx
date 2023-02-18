import { Switch } from '@headlessui/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';

export const ControlledPermissionCategory = ({
  fields = [],
  title = '',
  description = '',
}: {
  fields?: string[];
  title?: string;
  description?: string;
}) => {
  const { setValue, watch } = useFormContext();

  const value = watch(fields).reduce((a, v) => a && v, true);

  const onChange = (next: boolean) => {
    for (const field of fields) {
      setValue(field, next);
    }
  };

  return (
    <div className="-mb-2 ml-4 block basis-full">
      <div className="flex flex-row mt-8 justify-between">
        <h2 className="font-bold basis-full">{title}</h2>
        <Switch checked={value} onChange={onChange} className="h-full w-full">
          <div className={`mx-2 mr-4 w-full h-full p-3 relative`}>
            <div
              className={`${value ? 'bg-indigo-800' : 'bg-gray-500'}
          absolute right-1 top-1 inline-flex flex-shrink-0 h-[16px] w-[32px] border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus-visible:ring-2  focus-visible:ring-white focus-visible:ring-opacity-75`}
            >
              <span
                aria-hidden="true"
                className={`${value ? 'translate-x-[15px]' : 'translate-x-0'}
              pointer-events-none inline-block h-[12px] w-[12px] rounded-full bg-white shadow-lg transform ring-0 transition ease-in-out duration-200`}
              />
            </div>
          </div>
        </Switch>
      </div>
      <p className="text-xs text-gray-700">{description}</p>
    </div>
  );
};
