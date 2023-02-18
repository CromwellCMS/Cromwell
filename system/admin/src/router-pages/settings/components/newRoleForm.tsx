import { TextButton } from '@components/buttons/TextButton';
import { SwitchInput } from '@components/inputs/SwitchInput';
import { RegisteredTextInput } from '@components/inputs/TextInput';
import { toast } from '@components/toast';
import { TRole, TRoleInput } from '@cromwell/core';
import { Dialog, Transition } from '@headlessui/react';
import { slugify } from '@helpers/slugify';
import React, { Fragment } from 'react';
import { Controller, FormProvider, useForm } from 'react-hook-form';

import { useAdminSettings } from '../hooks/useAdminSettings';

type FormType = TRoleInput;

export const NewRoleForm = ({ show = false, onToggle }: { show: boolean; onToggle: (v: boolean) => void }) => {
  const { addRole, getRoles } = useAdminSettings();
  const methods = useForm<FormType>({
    defaultValues: {
      title: '',
      isEnabled: true,
      name: '',
      permissions: [],
    },
  });

  const { control, setValue, handleSubmit } = methods;

  const onSubmit = async (data: FormType) => {
    try {
      const done = await addRole(data);
      await getRoles();

      if (done) {
        onToggle(false);
      }
      toast.success(`Role created`);
    } catch (e) {
      toast.error(`Could not create role.`);
    }

    // const done = await addCustomEntityToDB(data);
  };

  return (
    <Transition appear show={show} as={Fragment}>
      <Dialog as="div" className="inset-0 z-[100] fixed overflow-y-auto" onClose={() => {}}>
        <FormProvider {...methods}>
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
                    New Role
                  </Dialog.Title>
                  <div className="my-2">
                    <p className="text-sm text-gray-500">Add a new custom role to the system.</p>
                  </div>

                  <div className="grid gap-2 grid-cols-1">
                    <RegisteredTextInput<TRole>
                      name="title"
                      label="Role Title"
                      placeholder="My Custom Role"
                      registerOptions={{ required: true }}
                      description="Human readable title for the role."
                      error={methods.formState.errors.title ? 'Title is required' : undefined}
                    />
                    <RegisteredTextInput<TRole>
                      name="name"
                      label="Name key"
                      placeholder="Will be filled automatically"
                      registerOptions={{ required: true }}
                      description="Internal key for role (will be automatically set)."
                      error={methods.formState.errors.name ? 'Name is required' : undefined}
                      onChange={(event) => {
                        const val = event.target.value;
                        setValue('name', slugify(val), { shouldDirty: true });
                      }}
                    />

                    <div>
                      <Controller
                        name="isEnabled"
                        control={control}
                        render={({ field }) => (
                          <SwitchInput
                            value={field.value}
                            onChange={field.onChange}
                            label={{
                              active: 'Role is active',
                              inactive: 'Role is disabled',
                            }}
                          />
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex flex-row mt-4 justify-end">
                    <TextButton
                      variant="outlined"
                      onClick={() => {
                        onToggle(false);
                      }}
                      type="submit"
                      className="mr-2"
                    >
                      cancel
                    </TextButton>
                    <TextButton type="submit">save</TextButton>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </form>
        </FormProvider>
      </Dialog>
    </Transition>
  );
};
