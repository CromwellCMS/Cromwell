import { matchPermissions, setStoreItem, TUser } from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';
import { Visibility as VisibilityIcon, VisibilityOff as VisibilityOffIcon } from '@mui/icons-material';
import { Button, IconButton, InputAdornment, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

import { toast } from '../../components/toast/toast';
import { useForm } from 'react-hook-form';
import { KeyIcon, LockClosedIcon, MailIcon } from '@heroicons/react/solid';
import { LoadingStatus } from '../../components/loadBox/LoadingStatus';
import { getSideBarLinksFlat } from '../../helpers/navigation';

export type TFromType = 'sign-in' | 'sign-up' | 'forgot-pass' | 'reset-pass';

type TEvent = { preventDefault: () => any };

const LoginPage = () => {
  const apiClient = getRestApiClient();
  const [loading, setLoading] = useState(false);
  const history = useHistory();
  const [formType, setFormType] = useState<TFromType>('sign-in');

  const [email, setEmail] = useState<string>('');

  const checkAuth = async (showError?: boolean) => {
    const userInfo = await apiClient.getUserInfo({ disableLog: true });
    if (userInfo?.id) {
      if (!userInfo.roles?.length || !userInfo.email) {
        if (showError) toast.error('Incorrect user account');
        return;
      }
      setStoreItem('userInfo', userInfo);
      loginSuccess(userInfo);
    } else {
      if (showError) toast.error('Incorrect email or password');
    }
  };

  const loginSuccess = (userInfo: TUser) => {
    if (!userInfo?.roles?.length) {
      toast.error('Access forbidden');
      return;
    }
    // Find a page with allowed permissions for this user
    const sidebarLinks = getSideBarLinksFlat();
    const allowed = sidebarLinks.find((link) => link.route && matchPermissions(userInfo, link.permissions));
    history?.push?.(allowed?.route ?? '/');
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const handleGoToForgotPass = () => {
    setFormType('forgot-pass');
  };

  return (
    <div className="bg-gradient-to-tr flex h-full from-indigo-900 to-pink-900 w-screen top-0 right-0 bottom-0 left-0 z-999 items-center fixed">
      <div className="bg-white rounded-lg mx-auto max-w-sm shadow-md w-full overflow-hidden dark:bg-gray-800">
        <div className="py-4 px-6">
          <img src="/admin/static/logo_small_black.svg" width="80px" className="mx-auto mt-3" />
          {formType === 'sign-in' && (
            <SignInForm
              onClickForget={handleGoToForgotPass}
              onSuccess={checkAuth}
              loading={loading}
              setLoading={setLoading}
            />
          )}
          {formType === 'forgot-pass' && (
            <ForgotPassForm
              onSuccess={(result) => {
                setEmail(result.email);
                setFormType(result.step);
              }}
              loading={loading}
              setLoading={setLoading}
            />
          )}
          {formType === 'reset-pass' && (
            <ResetPassForm email={email} onSuccess={setFormType} loading={loading} setLoading={setLoading} />
          )}
        </div>
      </div>
      <LoadingStatus isActive={loading} />
    </div>
  );
};

const ResetPassForm = ({ onSuccess, setLoading, loading, email }) => {
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
              <MailIcon className="h-5 w-5" />
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

const ForgotPassForm = ({ onSuccess, setLoading, loading }) => {
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
              <MailIcon className="h-5 w-5" />
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

const SignInForm = ({ onClickForget, onSuccess, setLoading, loading }) => {
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
        toast.error('Could not connect to the Server');
      } else {
        toast.error('Incorrect email or password');

        setError('email', {
          message: 'Invalid email or password',
        });
        setError('password', {
          message: 'Invalid email or password',
        });
      }

      console.error(e);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit(handleLoginClick)}>
      <div className="mt-4 w-full">
        <label htmlFor="email" className="text-xs mb-1 tracking-wide text-gray-600 sm:text-sm">
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

      <div className="flex mt-4 items-center justify-between">
        <button
          disabled={loading}
          className="rounded bg-gray-700 text-white py-2 px-4 transform transition-colors leading-5 duration-200 hover:bg-gray-600 focus:outline-none"
          type="submit"
        >
          Login
        </button>
      </div>
      <p onClick={onClickForget} className="my-2 hover:underline">
        Forgot password?
      </p>
    </form>
  );
};

export default LoginPage;
