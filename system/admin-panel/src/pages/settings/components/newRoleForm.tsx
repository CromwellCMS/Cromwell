import { Dialog, Transition } from "@headlessui/react"
import React, { Fragment, useState } from "react"
import { Controller, useForm } from "react-hook-form";
import { ActionButton } from "../../../components/actionButton"
import { TextInputField } from "../../../components/inputs/TextInput";
import { slugify } from "../../../helpers/slugify";
import { useAdminSettings } from "../../../hooks/useAdminSettings";
import { ImageInput } from "../../../components/inputs/Image/ImageInput";
import { TAdminCustomEntity, TRoleInput } from "@cromwell/core";
import { baseEntityColumns } from '../../../helpers/customEntities';
import { SwitchInput } from "../../../components/inputs/SwitchInput";

type FormType = TRoleInput;

export const NewRoleForm = ({
  show = false,
  onToggle = (v: boolean) => {}
}) => {
  const { adminSettings, saveCodeSettings, addRole } = useAdminSettings();
  const { register, watch, control, setValue, handleSubmit, setError } = useForm<FormType>({
    defaultValues: {
      title: "",
      isEnabled: true,
      name: "",
      permissions: [],
    },
  });

  const onSubmit = async (data: FormType) => {
    const done = await addRole(data);
    // const done = await addCustomEntityToDB(data);
    
    if (done) {
      onToggle(false);
    }
  }

  return (
    <Transition appear show={show} as={Fragment}>
        <Dialog
          as="div"
          className="inset-0 z-[100] fixed overflow-y-auto"
          onClose={() => {}}
        >
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
                <Dialog.Overlay onClick={() => onToggle(false)} className="bg-black h-screen bg-opacity-40 w-screen inset-0 fixed backdrop-blur backdrop-filter-xl" />
              </Transition.Child>

              {/* This element is to trick the browser into centering the modal contents. */}
              <span
                className="h-screen inline-block align-middle"
                aria-hidden="true"
              >
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
                  <Dialog.Title
                    as="h3"
                    className="font-medium text-xl text-gray-900 leading-6"
                  >
                    New Role
                  </Dialog.Title>
                  <div className="my-2">
                    <p className="text-sm text-gray-500">
                      Add a new custom role to the system.
                    </p>
                  </div>

                  <div className="grid gap-2 grid-cols-1">
                    <TextInputField
                      label="Role Title"
                      placeholder="My Custom Role"
                      required
                      description="Human readable title for the role."
                      {...register("title", { required: true, onChange: (event) => {
                        const val = event.target.value;
                        setValue("name", slugify(val))
                      }})}
                    />
                    <TextInputField
                      label="Name key"
                      placeholder="Will be filled automatically"
                      required
                      description="Internal key for role (will be automatically set)."
                      {...register("name", { required: true })}
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
                          active: "Role is active",
                          inactive: "Role is disabled",
                        }}
                      />
                    )}
                  />
                  </div>
                </div>

                  <div className="flex flex-row mt-4 justify-end">
                    <button onClick={() => {
                      onToggle(false)
                    }} className="bg-transparent mx-1 text-center text-sm py-1 px-2 text-gray-600 hover:text-indigo-500">
                      cancel
                    </button>
                    <ActionButton type="submit">
                      save
                    </ActionButton>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </form>
        </Dialog>
      </Transition>
  )
}