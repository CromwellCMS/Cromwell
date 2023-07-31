import { LoadingStatus } from '@components/loadBox/LoadingStatus';
import { toast } from '@components/toast/toast';
import { matchPermissions, setStoreItem, TUser } from '@cromwell/core';
import { getRestApiClient } from '@cromwell/core-frontend';
import { getSideBarLinksFlat } from '@helpers/navigation';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { ForgotPassForm } from './components/ForgotPassForm';
import { ResetPassForm } from './components/ResetPassForm';
import { SignInForm } from './components/SignInForm';

export type TFromType = 'sign-in' | 'sign-up' | 'forgot-pass' | 'reset-pass';

const LoginPage = () => {
  const apiClient = getRestApiClient();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [formType, setFormType] = useState<TFromType>('sign-in');

  const [email, setEmail] = useState<string>('');

  const checkAuth = async (showError?: boolean) => {
    const userInfo = await apiClient.getUserInfo({ disableLog: true }).catch(() => null);
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
    navigate(allowed?.route ?? '/');
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

export default LoginPage;
