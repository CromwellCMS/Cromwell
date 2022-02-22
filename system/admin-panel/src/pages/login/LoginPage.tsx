import { setStoreItem, TUser } from "@cromwell/core";
import { getRestApiClient } from "@cromwell/core-frontend";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";

import { toast } from "../../components/toast/toast";
import { useForm } from "react-hook-form";
import { KeyIcon, LockClosedIcon, MailIcon } from "@heroicons/react/solid";
import { LoadingStatus } from "../../components/loadBox/LoadingStatus";

export type TFromType =
  | "sign-in"
  | "sign-up"
  | "forgot-pass"
  | "reset-pass";

type TEvent = { preventDefault: () => any };

const LoginPage = () => {
  const apiClient = getRestApiClient();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [formType, setFormType] =
    useState<TFromType>("sign-in");

  const [email, setEmail] = useState<string>("");

  const checkAuth = async (showError?: boolean) => {
    // setLoading(true);
    const userInfo = await apiClient.getUserInfo({
      disableLog: true,
    });
    if (userInfo?.id) {
      if (!userInfo.role || !userInfo.email) {
        if (showError)
          toast.error("Incorrect user account");
        // setLoading(false);
        return;
      }
      setStoreItem("userInfo", userInfo);
      loginSuccess(userInfo);
    } else {
      if (showError)
        toast.error("Incorrect email or password");
    }
    // setLoading(false);
  };

  const loginSuccess = (userInfo: TUser) => {
    if (
      userInfo.role === "administrator" ||
      userInfo.role === "guest"
    ) {
      history?.push?.(`/`);
    } else if (userInfo.role === "author") {
      history?.push?.(`/post-list`);
    } else {
      toast.error("Access forbidden");
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleGoToForgotPass = () => {
    setFormType("forgot-pass");
  };

  return (
    <div className="w-screen h-full flex items-center z-999 fixed top-0 left-0 right-0 bottom-0 bg-gradient-to-tr from-indigo-900 to-pink-900">
      <div className="w-full max-w-sm mx-auto overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
        <div className="px-6 py-4">
          <img
            src="/admin/static/logo_small_black.svg"
            width="80px"
            className="mx-auto mt-3"
          />
          {formType === "sign-in" && (
            <SignInForm
              onClickForget={handleGoToForgotPass}
              onSuccess={checkAuth}
              loading={loading}
              setLoading={setLoading}
            />
          )}
          {formType === "forgot-pass" && (
            <ForgotPassForm
              onSuccess={(result) => {
                setEmail(result.email)
                setFormType(result.step)
              }}
              loading={loading}
              setLoading={setLoading}
            />
          )}
          {formType === "reset-pass" && (
            <ResetPassForm
              email={email}
              onSuccess={setFormType}
              loading={loading}
              setLoading={setLoading}
            />
          )}
        </div>
      </div>
      <LoadingStatus isActive={loading} />
    </div>
  );
};

const ResetPassForm = ({
  onSuccess,
  setLoading,
  loading,
  email,
}) => {
  const apiClient = getRestApiClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: email,
      password: "",
      code: "",
    },
  });

  const handleResetPass = async (data) => {
    setLoading(true);

    try {
      const success = await apiClient?.resetPassword({
        email: data.email,
        code: data.code,
        newPassword: data.password,
      });
      if (success) {
        toast.success("Password has been changed.");
        onSuccess("sign-in");
      } else {
        throw new Error("!success");
      }
    } catch (e) {
      console.error(e);
      let info = e?.message;
      try {
        info = JSON.parse(e.message);
      } catch (e) {}

      if (info?.statusCode === 429) {
      } else if (info?.statusCode === 417) {
        toast.error?.("Exceeded reset password attempts");
        // setCodeInput('')
        onSuccess("sign-in");
      } else {
        toast.error?.(
          "Incorrect e-mail or user was not found",
        );
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(handleResetPass)}>
      <div className="w-full my-3 bg-green-800 rounded-md text-white p-2">
        We sent you an e-mail with reset code. Copy the code below and create a new password
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
            disabled={true}
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
          htmlFor="code"
          className="mb-1 text-xs sm:text-sm tracking-wide text-gray-600">
          Code
        </label>

        <div className="relative">
          <div className="absolute flex border border-transparent left-0 top-0 h-full w-10">
            <div className="flex items-center justify-center rounded-tl-lg rounded-bl-lg z-10 bg-gray-100 text-gray-600 text-lg h-full w-full">
              <LockClosedIcon className="h-5 w-5" />
            </div>
          </div>

          <input
            type="text"
            placeholder="123456"
            disabled={loading}
            {...register("code", {
              required: true,
            })}
            className={`text-sm sm:text-base relative w-full border ${
              errors.code
                ? "border-red-500"
                : "border-gray-200"
            } shadow-md focus:shadow-indigo-300 rounded-lg placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-12`}
          />
        </div>
        <span className="flex items-center font-medium tracking-wide text-red-500 text-xs mt-1 ml-1">
          {errors.code && errors.code.message}
        </span>
      </div>

      <div className="flex items-center justify-between mt-4">
        <button
          disabled={loading}
          className="px-4 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray-700 rounded hover:bg-gray-600 focus:outline-none"
          type="submit">
          Change Password
        </button>
      </div>
    </form>
  );
};

const ForgotPassForm = ({
  onSuccess,
  setLoading,
  loading,
}) => {
  const apiClient = getRestApiClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleForgotPass = async (data) => {
    setLoading(true);

    try {
      const success = await apiClient?.forgotPassword(
        { email: data.email },
        { disableLog: true },
      );
      if (success) {
        toast.success("We sent you an e-mail");
        onSuccess({
          step: "reset-pass",
          email: data.email,
        });
      } else {
        throw new Error("!success");
      }
    } catch (e) {
      console.error(e);
      let info = e?.message;
      try {
        info = JSON.parse(e.message);
      } catch (e) {}

      if (info?.statusCode === 429) {
      } else {
        toast.error?.(
          "Incorrect e-mail or user was not found",
        );
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(handleForgotPass)}>
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

      <div className="flex items-center justify-between mt-4">
        <button
          disabled={loading}
          className="px-4 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray-700 rounded hover:bg-gray-600 focus:outline-none"
          type="submit">
          Reset Password
        </button>
      </div>
    </form>
  );
};

const SignInForm = ({
  onClickForget,
  onSuccess,
  setLoading,
  loading,
}) => {
  const apiClient = getRestApiClient();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm();

  const handleLoginClick = async (data) => {
    setLoading(true);
    try {
      await apiClient.login(
        {
          email: data.email,
          password: data.password,
        },
        { disableLog: true },
      );

      onSuccess(true);
    } catch (e) {
      if (e.statusCode === 0) {
        toast.error("Could not connect to the Server");
      } else {
        toast.error("Incorrect email or password");

        setError("email", {
          message: "Invalid email or password",
        });
        setError("password", {
          message: "Invalid email or password",
        });
      }

      console.error(e);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(handleLoginClick)}>
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

      <div className="flex items-center justify-between mt-4">
        <button
          disabled={loading}
          className="px-4 py-2 leading-5 text-white transition-colors duration-200 transform bg-gray-700 rounded hover:bg-gray-600 focus:outline-none"
          type="submit">
          Login
        </button>
      </div>
      <p
        onClick={onClickForget}
        className="hover:underline my-2">
        Forgot password?
      </p>
    </form>
  );
};

export default LoginPage;
