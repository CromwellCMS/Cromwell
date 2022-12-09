import { toast } from '@components/toast/toast';
import { getRestApiClient } from '@cromwell/core-frontend';
import { EnvelopeIcon, KeyIcon, LockClosedIcon } from '@heroicons/react/24/solid';
import React from 'react';
import { useForm } from 'react-hook-form';

export const ResetPassForm = ({ onSuccess, setLoading, loading, email }) => {
  const apiClient = getRestApiClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: email,
      password: '',
      code: '',
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
        toast.success('Password has been changed.');
        onSuccess('sign-in');
      } else {
        throw new Error('!success');
      }
    } catch (e) {
      console.error(e);
      let info = e?.message;
      try {
        info = JSON.parse(e.message);
      } catch (e) {}

      if (info?.statusCode === 429) {
      } else if (info?.statusCode === 417) {
        toast.error?.('Exceeded reset password attempts');
        // setCodeInput('')
        onSuccess('sign-in');
      } else {
        toast.error?.('Incorrect e-mail or user was not found');
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(handleResetPass)}>
      <div className="rounded-md bg-green-800 my-3 text-white w-full p-2">
        We sent you an e-mail with reset code. Copy the code below and create a new password
      </div>
      <div className="mt-4 w-full">
        <label htmlFor="email" className="text-xs mb-1 tracking-wide text-gray-600 sm:text-sm">
          Email
        </label>

        <div className="relative">
          <div className="border border-transparent flex h-full top-0 left-0 w-10 absolute">
            <div className="rounded-tl-lg rounded-bl-lg flex h-full bg-gray-100 text-lg w-full text-gray-600 z-10 items-center justify-center">
              <EnvelopeIcon className="h-5 w-5" />
            </div>
          </div>

          <input
            type="email"
            placeholder="Email Address"
            disabled={true}
            {...register('email', { required: true })}
            className={`text-sm sm:text-base relative w-full border ${
              errors.email ? 'border-red-500' : 'border-gray-200'
            } shadow-md focus:shadow-indigo-300 rounded-lg placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-12`}
          />
        </div>
        <span className="flex font-medium mt-1 text-xs tracking-wide ml-1 text-red-500 items-center">
          {errors.email && 'Please provide an email address.'}
        </span>
      </div>

      <div className="mt-4 w-full">
        <label htmlFor="password" className="text-xs mb-1 tracking-wide text-gray-600 sm:text-sm">
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
            {...register('password', {
              required: true,
            })}
            className={`text-sm sm:text-base relative w-full border ${
              errors.password ? 'border-red-500' : 'border-gray-200'
            } shadow-md focus:shadow-indigo-300 rounded-lg placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-12`}
          />
        </div>
        <span className="flex font-medium mt-1 text-xs tracking-wide ml-1 text-red-500 items-center">
          {errors.password && errors.password.message}
        </span>
      </div>

      <div className="mt-4 w-full">
        <label htmlFor="code" className="text-xs mb-1 tracking-wide text-gray-600 sm:text-sm">
          Code
        </label>

        <div className="relative">
          <div className="border border-transparent flex h-full top-0 left-0 w-10 absolute">
            <div className="rounded-tl-lg rounded-bl-lg flex h-full bg-gray-100 text-lg w-full text-gray-600 z-10 items-center justify-center">
              <LockClosedIcon className="h-5 w-5" />
            </div>
          </div>

          <input
            type="text"
            placeholder="123456"
            disabled={loading}
            {...register('code', {
              required: true,
            })}
            className={`text-sm sm:text-base relative w-full border ${
              errors.code ? 'border-red-500' : 'border-gray-200'
            } shadow-md focus:shadow-indigo-300 rounded-lg placeholder-gray-400 focus:border-indigo-400 focus:outline-none py-2 pr-2 pl-12`}
          />
        </div>
        <span className="flex font-medium mt-1 text-xs tracking-wide ml-1 text-red-500 items-center">
          {errors.code && errors.code.message}
        </span>
      </div>

      <div className="flex mt-4 items-center justify-between">
        <button
          disabled={loading}
          className="rounded bg-gray-700 text-white py-2 px-4 transform transition-colors leading-5 duration-200 hover:bg-gray-600 focus:outline-none"
          type="submit"
        >
          Change Password
        </button>
      </div>
    </form>
  );
};
