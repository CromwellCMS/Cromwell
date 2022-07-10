import { setStoreItem, TUser } from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';
import { KeyIcon, MailIcon, UserIcon } from '@heroicons/react/solid';
import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';

import { ImagePicker } from '../../../components/imagePicker/ImagePicker';

export function UserForm(props: {
  onSuccess: (user: TUser) => void;
}) {
  const apiClient = getRestApiClient();
  const [avatarInput, setAvatarInput] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const init = async () => {
    await checkAuth();
  }

  const checkAuth = async () => {
    try {
      const userInfo = await apiClient.getUserInfo({
        disableLog: true,
      });
      if (userInfo) {
        setStoreItem("userInfo", userInfo);
        props.onSuccess(userInfo);
      }
      return userInfo;
    } catch (error) {
      console.error(error);
    }
  }

  const handleSubmitClick = async (data) => {
    if (loading) return;

    const { email, password, name, passwordConfirm } = data;

    if (password !== passwordConfirm) {
      setError("password", { type: "manual", message: "Passwords don't match." });
      setError("passwordConfirm", { type: "manual", message: "Passwords don't match." });
      return;
    }

    setLoading(true);

    try {
      await apiClient.login({
        email: email,
        password: password,
      }, { disableLog: true });

      const user = await checkAuth();
      if (user) return;
    } catch (error) {
      console.error(error);
    }

    try {
      await apiClient.setupCmsFirstStep({
        user: {
          fullName: name,
          email: email,
          password: password,
          avatar: avatarInput,
        }
      });

      await apiClient.login({
        email: email,
        password: password,
      });

      await checkAuth();

    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    init();
  }, []);


  return (
    <div>
      <h2 className="font-medium mt-1 text-xl text-center text-gray-600 dark:text-gray-200">
        Let&apos;s create your account.
      </h2>

      {/* <p cl  */}
      <div className="flex flex-col mt-2 w-full">
        <ImagePicker
          toolTip="Pick avatar"
          onChange={setAvatarInput}
          value={avatarInput}
          className="mx-auto mt-2 inline-block"
          hideSrc
        />
      </div>

      <form onSubmit={handleSubmit(handleSubmitClick)}>
        <div className="mt-4 w-full">
          <label
            htmlFor="name"
            className="text-xs mb-1 tracking-wide text-gray-600 sm:text-sm">
            Name
          </label>

          <div className="relative">
            <div className="border border-transparent flex h-full top-0 left-0 w-10 absolute">
              <div className="rounded-tl-lg rounded-bl-lg flex h-full bg-gray-100 text-lg w-full text-gray-600 z-10 items-center justify-center">
                <UserIcon className="h-5 w-5" />
              </div>
            </div>

            <input
              type="text"
              placeholder="Name"
              disabled={loading}
              {...register("name", { required: true })}
              className={`text-sm sm:text-base relative w-full border ${errors.name
                ? "border-red-500"
                : "border-gray-200"
                } shadow-md focus:shadow-indigo-300 rounded-lg placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-12`}
            />
          </div>
          <span className="flex font-medium mt-1 text-xs tracking-wide ml-1 text-red-500 items-center">
            {errors.name && "Please provide a name."}
          </span>
        </div>

        <div className="mt-4 w-full">
          <label
            htmlFor="email"
            className="text-xs mb-1 tracking-wide text-gray-600 sm:text-sm">
            Email
          </label>

          <div className="relative">
            <div className="border border-transparent flex h-full top-0 left-0 w-10 absolute">
              <div className="rounded-tl-lg rounded-bl-lg flex h-full bg-gray-100 text-lg w-full text-gray-600 z-10 items-center justify-center">
                <MailIcon className="h-5 w-5" />
              </div>
            </div>

            <input
              type="email"
              placeholder="Email Address"
              disabled={loading}
              {...register("email", { required: true })}
              className={`text-sm sm:text-base relative w-full border ${errors.email
                ? "border-red-500"
                : "border-gray-200"
                } shadow-md focus:shadow-indigo-300 rounded-lg placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-12`}
            />
          </div>
          <span className="flex font-medium mt-1 text-xs tracking-wide ml-1 text-red-500 items-center">
            {errors.email &&
              "Please provide an email address."}
          </span>
        </div>

        <div className="mt-4 w-full">
          <label
            htmlFor="password"
            className="text-xs mb-1 tracking-wide text-gray-600 sm:text-sm">
            Password
          </label>

          <div className="relative">
            <div className="border border-transparent flex h-full top-0 left-0 w-10 absolute">
              <div className="rounded-tl-lg rounded-bl-lg flex h-full bg-gray-100 text-lg w-full text-gray-600 z-10 items-center justify-center">
                <KeyIcon className="h-5 w-5" />
              </div>
            </div>

            <input
              type="password"
              placeholder="******"
              disabled={loading}
              {...register("password", {
                required: true,
              })}
              className={`text-sm sm:text-base relative w-full border ${errors.password
                ? "border-red-500"
                : "border-gray-200"
                } shadow-md focus:shadow-indigo-300 rounded-lg placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-12`}
            />
          </div>
          <span className="flex font-medium mt-1 text-xs tracking-wide ml-1 text-red-500 items-center">
            {errors.password && errors.password.message}
          </span>
        </div>
        <div className="mt-4 w-full">
          <label
            htmlFor="passwordConfirm"
            className="text-xs mb-1 tracking-wide text-gray-600 sm:text-sm">
            Confirm Password
          </label>

          <div className="relative">
            <div className="border border-transparent flex h-full top-0 left-0 w-10 absolute">
              <div className="rounded-tl-lg rounded-bl-lg flex h-full bg-gray-100 text-lg w-full text-gray-600 z-10 items-center justify-center">
                <KeyIcon className="h-5 w-5" />
              </div>
            </div>

            <input
              type="password"
              placeholder="******"
              disabled={loading}
              {...register("passwordConfirm", {
                required: true,
              })}
              className={`text-sm sm:text-base relative w-full border ${errors.passwordConfirm
                ? "border-red-500"
                : "border-gray-200"
                } shadow-md focus:shadow-indigo-300 rounded-lg placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-12`}
            />
          </div>
          <span className="flex font-medium mt-1 text-xs tracking-wide ml-1 text-red-500 items-center">
            {errors.passwordConfirm && errors.passwordConfirm.message}
          </span>
        </div>

        <div className="flex mt-6 items-center justify-between">
          <button
            disabled={loading}
            className="rounded bg-gray-700 text-white py-2 px-4 transform transition-colors leading-5 duration-200 hover:bg-gray-600 focus:outline-none"
            type="submit">
            Create
          </button>
        </div>
      </form>
    </div>
  )
}
