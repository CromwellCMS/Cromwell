import { TAdminCustomEntity } from '@cromwell/core';
import { Dialog, Transition } from '@headlessui/react';
import React, { Fragment, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import { ActionButton } from '../../../components/actionButton';
import { ImageInput } from '../../../components/inputs/Image/ImageInput';
import { TextInput } from '../../../components/inputs/TextInput/TextInput';
import { baseEntityColumns } from '../../../helpers/customEntities';
import { slugify } from '../../../helpers/slugify';
import { useAdminSettings } from '../hooks/useAdminSettings';

type FormType = TAdminCustomEntity;

export const NewEntityForm = ({ show = false, onToggle = (v: boolean) => {} }) => {
  const { adminSettings, saveCodeSettings, addCustomEntityToDB } = useAdminSettings();
  const [uniqError, setUniqError] = useState(false);
  const { register, watch, control, setValue, handleSubmit, setError } = useForm<FormType>({
    defaultValues: {
      entityType: '',
      listLabel: '',
      entityLabel: '',
      icon: '',
      columns: [...baseEntityColumns.map((col) => ({ ...col, visible: true }))],
    },
  });

  const onSubmit = async (data: FormType) => {
    const exists = adminSettings.customEntities?.find((e) => e.entityType === data.entityType);

    if (exists) {
      setUniqError(true);
      return;
    }

    const done = await addCustomEntityToDB(data);

    if (done) {
      onToggle(false);
    }
  };

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="inset-0 z-[100] fixed overflow-y-auto" onClose={() => {}}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="min-h-screen text-center px-4">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay
                onClick={() => onToggle(false)}
                className="bg-black h-screen bg-opacity-40 w-screen inset-0 fixed backdrop-blur backdrop-filter-xl"
              />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="h-screen inline-block align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-400"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="bg-white max-w-xl rounded-2xl shadow-xl my-8 text-left w-full p-6 transform transition-all inline-block overflow-hidden align-middle">
                <Dialog.Title as="h3" className="font-medium text-xl text-gray-900 leading-6">
                  New Entity
                </Dialog.Title>
                <div className="my-2">
                  <p className="text-sm text-gray-500">Add a new custom entity to the system.</p>
                </div>

                <div className="grid gap-2 grid-cols-1">
                  <TextInput
                    label="Entity Label"
                    placeholder="My Custom Entity"
                    required
                    description="Singular title for the entity."
                    {...register('entityLabel', {
                      required: true,
                      onChange: (event) => {
                        const val = event.target.value;
                        setValue('entityType', slugify(val));
                      },
                    })}
                  />
                  <TextInput
                    label="Plural label"
                    placeholder="My Custom Entities"
                    required
                    description="Plural title for the entity."
                    {...register('listLabel', { required: true })}
                  />
                  <TextInput
                    label="Entity Type"
                    placeholder="my-custom-entity"
                    required
                    error={
                      uniqError
                        ? 'An Entity with the same Entity Type already exists. Please change the entity type.'
                        : null
                    }
                    description="The entity type is the unique identifier and used in the url. There's no need to change this value unless you want a different url identifier."
                    {...register('entityType', {
                      required: true,
                      onChange: (event) => {
                        setValue('entityType', slugify(event.target.value));
                      },
                    })}
                  />
                  <div>
                    <Controller
                      name="icon"
                      control={control}
                      render={({ field }) => (
                        <ImageInput
                          key={field.name}
                          onChange={(value) => field.onChange(value ?? '')}
                          value={field.value}
                          id="control"
                          label={'Icon'}
                          showRemove
                          backgroundSize="contain"
                          className="h-52 max-w-[12rem]"
                        />
                      )}
                    />
                    <p className="text-xs text-gray-400">
                      SVG Vector files with {'fill="currentColor"'} work best as icons.
                    </p>
                  </div>
                </div>

                <div className="flex flex-row mt-4 justify-end">
                  <button
                    onClick={() => {
                      onToggle(false);
                    }}
                    className="bg-transparent mx-1 text-center text-sm py-1 px-2 text-gray-600 hover:text-indigo-500"
                  >
                    cancel
                  </button>
                  <ActionButton type="submit">save</ActionButton>
                </div>
              </div>
            </Transition.Child>
          </div>
        </form>
      </Dialog>
    </Transition>
  );
};
