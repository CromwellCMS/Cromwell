import { toast } from '@components/toast/toast';
import { getRestApiClient } from '@cromwell/core-frontend';
import { EnvelopeIcon } from '@heroicons/react/24/solid';
import React from 'react';
import { useForm } from 'react-hook-form';

export const ForgotPassForm = ({ onSuccess, setLoading, loading }) => {
  const apiClient = getRestApiClient();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const handleForgotPass = async (data) => {
    setLoading(true);

    try {
      const success = await apiClient?.forgotPassword({ email: data.email }, { disableLog: true });
      if (success) {
        toast.success('We sent you an e-mail');
        onSuccess({
          step: 'reset-pass',
          email: data.email,
        });
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
      } else {
        toast.error?.('Incorrect e-mail or user was not found');
      }
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(handleForgotPass)}>
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
            disabled={loading}
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

      <div className="flex mt-4 items-center justify-between">
        <button
          disabled={loading}
          className="rounded bg-gray-700 text-white py-2 px-4 transform transition-colors leading-5 duration-200 hover:bg-gray-600 focus:outline-none"
          type="submit"
        >
          Reset Password
        </button>
      </div>
    </form>
  );
};
