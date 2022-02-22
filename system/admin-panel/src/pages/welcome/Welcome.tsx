import { setStoreItem } from "@cromwell/core";
import {
  getGraphQLClient,
  getRestApiClient,
} from "@cromwell/core-frontend";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useHistory } from "react-router-dom";

import { ImagePicker } from "../../components/imagePicker/ImagePicker";
import { LoadingStatus } from "../../components/loadBox/LoadingStatus";
import {
  KeyIcon,
  MailIcon,
  UserIcon,
} from "@heroicons/react/solid";
import { toast } from "../../components/toast/toast";

export default function WelcomePage() {
  const apiClient = getRestApiClient();
  const graphQLClient = getGraphQLClient();
  const history = useHistory();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();
  const [submitPressed, setSubmitPressed] = useState(false);
  const [avatarInput, setAvatarInput] = useState<
    string | null
  >(null);
  const [loading, setLoading] = useState(false);

  const handleSubmitClick = async (data) => {
    setSubmitPressed(true);

    setLoading(true);

    const { email, password, name, passwordConfirm } = data;

    if (password !== passwordConfirm) {
        setError("password", { type: "manual", message: "Passwords don't match." });
        setError("passwordConfirm", { type: "manual", message: "Passwords don't match." });
    }

    try {
      await graphQLClient.createUser({
        fullName: name,
        email: email,
        password: password,
        avatar: avatarInput,
        role: "administrator",
      });
    } catch (e) {
      toast.error(
        "Failed to create user with provided credentials",
      );
      console.error(e);
      setLoading(false);
      return;
    }

    try {
      await apiClient.setUpCms({
        url: window.location.origin,
      });

      await apiClient.login({
        email: email,
        password: password,
      });
    } catch (e) {
      console.error(e);
    }

    checkAuth();

    setLoading(false);
  };

  const checkAuth = async () => {
    const userInfo = await apiClient.getUserInfo({
      disableLog: true,
    });
    if (userInfo) {
      setStoreItem("userInfo", userInfo);
      history?.push?.(`/`);
    }
  };

  return (
    <div className="w-screen h-full flex items-center z-999 fixed top-0 left-0 right-0 bottom-0 bg-gray-200 dark:bg-black">
      <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="px-6 py-4">
          <img
            src="/admin/static/logo_small_black.svg"
            width="80px"
            className="mx-auto mt-3"
          />
          <h1 className="text-3xl font-bold text-center text-gray-700 dark:text-white">
            Welcome to Cromwell CMS!
          </h1>

          <h2 className="mt-1 text-xl font-medium text-center text-gray-600 dark:text-gray-200">
            Let&apos;s create your account.
          </h2>

          {/* <p cl  */}
          <div className="w-full flex flex-col mt-2">
            <ImagePicker
                toolTip="Pick avatar"
                onChange={setAvatarInput}
                value={avatarInput}
                className="mx-auto mt-2 inline-block"
                hideSrc
            />
          </div>

          <form onSubmit={handleSubmit(handleSubmitClick)}>
            <div className="w-full mt-4">
              <label
                htmlFor="name"
                className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                Name
              </label>

              <div className="relative">
                <div className="absolute flex border border-transparent left-0 top-0 h-full w-10">
                  <div className="flex items-center justify-center rounded-tl-lg rounded-bl-lg z-10 bg-gray-100 text-gray-600 text-lg h-full w-full">
                    <UserIcon className="h-5 w-5" />
                  </div>
                </div>

                <input
                  type="text"
                  placeholder="Name"
                  disabled={loading}
                  {...register("name", { required: true })}
                  className={`text-sm sm:text-base relative w-full border ${
                    errors.name
                      ? "border-red-500"
                      : "border-gray-200"
                  } shadow-md focus:shadow-indigo-300 rounded-lg placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-12`}
                />
              </div>
              <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                {errors.name && "Please provide a name."}
              </span>
            </div>

            <div className="w-full mt-4">
              <label
                htmlFor="email"
                className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                Email
              </label>

              <div className="relative">
                <div className="absolute flex border border-transparent left-0 top-0 h-full w-10">
                  <div className="flex items-center justify-center rounded-tl-lg rounded-bl-lg z-10 bg-gray-100 text-gray-600 text-lg h-full w-full">
                    <MailIcon className="h-5 w-5" />
                  </div>
                </div>

                <input
                  type="email"
                  placeholder="Email Address"
                  disabled={loading}
                  {...register("email", { required: true })}
                  className={`text-sm sm:text-base relative w-full border ${
                    errors.email
                      ? "border-red-500"
                      : "border-gray-200"
                  } shadow-md focus:shadow-indigo-300 rounded-lg placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-12`}
                />
              </div>
              <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                {errors.email &&
                  "Please provide an email address."}
              </span>
            </div>

            <div className="w-full mt-4">
              <label
                htmlFor="password"
                className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                Password
              </label>

              <div className="relative">
                <div className="absolute flex border border-transparent left-0 top-0 h-full w-10">
                  <div className="flex items-center justify-center rounded-tl-lg rounded-bl-lg z-10 bg-gray-100 text-gray-600 text-lg h-full w-full">
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
                  className={`text-sm sm:text-base relative w-full border ${
                    errors.password
                      ? "border-red-500"
                      : "border-gray-200"
                  } shadow-md focus:shadow-indigo-300 rounded-lg placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-12`}
                />
              </div>
              <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                {errors.password && errors.password.message}
              </span>
            </div>
            <div className="w-full mt-4">
              <label
                htmlFor="passwordConfirm"
                className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
                Confirm Password
              </label>

              <div className="relative">
                <div className="absolute flex border border-transparent left-0 top-0 h-full w-10">
                  <div className="flex items-center justify-center rounded-tl-lg rounded-bl-lg z-10 bg-gray-100 text-gray-600 text-lg h-full w-full">
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
                  className={`text-sm sm:text-base relative w-full border ${
                    errors.passwordConfirm
                      ? "border-red-500"
                      : "border-gray-200"
                  } shadow-md focus:shadow-indigo-300 rounded-lg placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-12`}
                />
              </div>
              <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
                {errors.passwordConfirm && errors.passwordConfirm.message}
              </span>
            </div>

            <div className="flex items-center justify-between mt-4">
              <button
                disabled={loading}
                className="px-4 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray-700 rounded hover:bg-gray-600 focus:outline-none"
                type="submit">
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
      <LoadingStatus isActive={loading} />
    </div>
  );
}
