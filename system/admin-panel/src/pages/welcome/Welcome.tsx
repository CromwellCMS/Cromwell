import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import { CmsSettingsForm } from './components/CmsSettingsForm';
import { UserForm } from './components/UserForm';

export default function WelcomePage() {
  const history = useHistory();
  const [step, setStep] = useState<'account' | 'settings'>('account');

  const onAccountSuccess = () => {
    setStep('settings');
  }

  const onSettingsSuccess = () => {
    history?.push?.(`/`);
  }

  return (
    <div className="flex h-full bg-gray-200 w-screen top-0 right-0 bottom-0 left-0 z-999 items-center fixed dark:bg-black">
      <div className="bg-white rounded-lg mx-auto max-w-sm shadow-md w-full overflow-hidden dark:bg-gray-800">
        <div className="py-4 px-6">
          <img
            src="/admin/static/logo_small_black.svg"
            width="80px"
            className="mx-auto mt-3 mb-6"
          />
          <h1 className="font-bold text-center text-3xl text-gray-700 dark:text-white">
            Welcome to Cromwell CMS!
          </h1>
          {step === 'account' && (
            <UserForm
              onSuccess={onAccountSuccess}
            />
          )}
          {step === 'settings' && (
            <CmsSettingsForm
              onSuccess={onSettingsSuccess}
            />
          )}
        </div>
      </div>
    </div>
  );
}
